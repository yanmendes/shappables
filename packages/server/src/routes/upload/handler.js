// eslint-disable-next-line
import e from 'express'
import { validationResult } from 'express-validator'
import { S3 } from 'aws-sdk'
import { nanoid } from 'nanoid'
import { Client } from '@elastic/elasticsearch'

import { isInvalidImage } from './validator'
import { imageBucket, imageBucketEndpoint, esEndpoint, esIndex } from '../../config'
import { Image } from '../../services/db'

/**
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export default (req, res) => {
  const log = req.log

  const { errors } = validationResult(req)
  if (errors.length) {
    log.child({ errors }).warn('Invalid payload')
    return res.status(400).send({ errors })
  }

  const imageErrors = isInvalidImage(req.files.image)
  if (imageErrors) {
    log.child({ errors: imageErrors }).warn('Invalid payload')
    return res.status(400).send({ errors: imageErrors })
  }

  const S3Client = new S3()
  const esClient = new Client({ node: esEndpoint })
  const [, imageExtension] = req.files.image.mimetype.match(/image\/(\w+)/)
  const id = `${nanoid()}.${imageExtension}`
  const image = {
    id,
    name: req.files.image.name,
    description: req.body.description,
    fileType: req.files.image.mimetype,
    size: req.files.image.size,
    url: `${imageBucketEndpoint}/${id}`
  }

  log.debug('Uploading image to bucket...')
  return S3Client.putObject({
    Body: req.files.image.data,
    Bucket: imageBucket,
    Key: id
  })
    .promise()
    .then(() => log.debug('Persisting image info in DB...'))
    .then(() => Image.create(image))
    .then(() => log.debug('Persisting image info in ES...'))
    .then(() => esClient.index({ id, index: esIndex, body: image, refresh: true }))
    .then(() => res.status(201).send())
    .catch(e => {
      log
        .child({ payload: req.body, stack: e.stack, error: e.message })
        .error('Error while uploading the image... Rolling back resources.')

      log.debug('Deleting S3 Object')
      return S3Client.deleteObject({
        Bucket: imageBucket,
        Key: id
      })
        .promise()
        .catch(e =>
          log
            .child({ stack: e.stack, error: e.message })
            .error('Error connecting to the bucket')
        )
        .then(() => log.debug('Deleting database record'))
        .then(() => Image.destroy({ where: { id } }))
        .then(() => log.debug('Deleting index in ES'))
        .then(() => esClient.delete({ index: esIndex, id }))
        .catch(e =>
          log
            .child({ stack: e.stack, error: e.message })
            .error('Error connecting to the Elastic Search cluster')
        )
        .finally(() =>
          res.status(500).json({
            message: 'Something unexpected happened while uploading the image',
            errors: e
          })
        )
    })
}
