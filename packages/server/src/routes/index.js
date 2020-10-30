import { Router } from 'express'

import upload from './upload'

export default Router()
  .post('/upload', upload.validator, upload.handler)
