import bodyParser from 'body-parser'
import express from 'express'
import pino from 'express-pino-logger'
import fileUpload from 'express-fileupload'
import cors from 'cors'

import logger from './logger'
import routes from './routes'
import { maxFileSize } from './config'

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(pino({ logger }))
app.use(fileUpload({
  limits: {
    fileSize: maxFileSize
  },
  abortOnLimit: true
}));
app.use(routes)

export default app
