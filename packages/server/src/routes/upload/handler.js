// eslint-disable-next-line
import e from 'express'
import { validationResult } from 'express-validator'
import {isInvalidImage } from './validator'

const category = 'http/upload'
/**
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export default (req, res) => {
  const log = req.log.child({
    category,
  })

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

  return Promise.resolve(log.info('Uploading image to bucket...'))
    .then(() => res.status(201).send())
    .catch(e => {
      log
        .child({ payload: req.body, stack: e.stack, error: e.message })
        .error('Error while uploading the image...')

      res.status(500).json({
        message: 'Something unexpected happened while uploading the transaction',
        errors: e,
      })
    })
}
