import logger from './logger'
import { port } from './config'
import app from './server'
import db from './services/db'

const category = 'server_setup'
const log = logger.child({ category })

;(async () => {
  try {
    logger.debug('Connecting to the database...')
    await db.sync()
    app.listen({ port }, () =>
      logger.info(`🚀 Server ready at http://localhost:${port}`)
    )
  } catch (e) {
    log
      .child({
        action: 'initializing_server',
        msg: e.message,
        stack: e.stack
      })
      .error('Something went wrong while connecting to the broker...')
  }
})()
