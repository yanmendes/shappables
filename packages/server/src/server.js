import bodyParser from 'body-parser'
import express from 'express'
import pino from 'express-pino-logger'
import fileUpload from 'express-fileupload'

import logger from './logger'
import routes from './routes'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(pino({ logger }))
app.use(fileUpload({
  limits: {
    fileSize: 500 * 1024 // 500kb
  },
  abortOnLimit: true
}));
app.use(routes)

export default app
