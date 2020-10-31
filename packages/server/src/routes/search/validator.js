import { checkSchema } from 'express-validator'

import { validFileExtensions } from '../../services/db/Image'
import { maxFileSize } from '../../config'

const schema = checkSchema({
  fileType: {
    in: 'query',
    optional: true,
    isIn: {
      options: [validFileExtensions],
      errorMessage: 'Invalid image type'
    },
  },
  description: {
    in: 'query',
    optional: true,
  },
  size: {
    in: 'query',
    optional: true,
    isInt: {
      options: { min: 1, max: maxFileSize },
      errorMessage: 'Invalid value. Valid range: [1, 512.000]'
    }
  },
  offset: {
    in: 'query',
    optional: true,
    isInt: {
      options: { min: 0 },
      errorMessage: 'Invalid value. Only positive values allowed'
    }
  }
})

export default schema
