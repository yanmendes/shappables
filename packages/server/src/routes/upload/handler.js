// eslint-disable-next-line
import e from 'express'
import { validationResult } from 'express-validator'
import { S3 } from 'aws-sdk'
import { nanoid } from 'nanoid'

import { isInvalidImage } from './validator'
import { imageBucket } from '../../config'
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
  const [, imageExtension] = req.files.image.mimetype.match(/image\/(\w+)/)
  const id = `${nanoid()}.${imageExtension}`

  log.info('Uploading image to bucket...')
  return S3Client.putObject({
    Body: req.files.image.data,
    Bucket: imageBucket,
    Key: id
  })
    .promise()
    .then(() =>
      Image.create({
        id,
        name: req.files.image.name,
        description: req.body.description,
        fileType: req.files.image.mimetype,
        size: req.files.image.size
      })
    )
    .then(() => res.status(201).send())
    .catch(async e => {
      log
        .child({ payload: req.body, stack: e.stack, error: e.message })
        .error('Error while uploading the image... Deleting it.')

      await S3Client.deleteObject({
        Bucket: imageBucket,
        Key: id
      })
        .promise()
        .catch(e => log.child({ stack: e.stack, error: e.message }).error('Error connecting to the bucket'))
        .finally(() =>
          res.status(500).json({
            message: 'Something unexpected happened while uploading the image',
            errors: e
          })
        )
    })
}
