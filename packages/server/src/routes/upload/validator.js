// eslint-disable-next-line
import e from 'express-fileupload'
import { checkSchema } from 'express-validator'
import { validFileExtensions } from '../../services/db/Image'

const schema = checkSchema({
  description: {
    notEmpty: true
  }
})

/**
 * @param {e.UploadedFile} image
 */
export const isInvalidImage = image =>
  (!image || !validFileExtensions.includes(image.mimetype)) && [
    {
      msg: 'Invalid image format',
      param: 'image',
      location: 'files'
    }
  ]

export default schema
