import { Router } from 'express'

import upload from './upload'
import search from './search'

export default Router()
  .post('/upload', upload.validator, upload.handler)
  .get('/search', search.validator, search.handler)
