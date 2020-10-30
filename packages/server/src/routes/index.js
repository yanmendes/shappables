import { Router } from 'express'

import upload from './upload'
import auth from './authorizer'

export default Router()
  .post('/upload', upload.validator, upload.handler)
  .get('/_auth', auth.handler, (_, res) => res.send('ok'))
