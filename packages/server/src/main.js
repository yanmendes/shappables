import { Client } from '@elastic/elasticsearch'

import logger from './logger'
import { port, esEndpoint, esIndex } from './config'
import app from './server'
import db from './services/db'

const category = 'server_setup'
const log = logger.child({ category })
const esClient = new Client({ node: esEndpoint })

;(async () => {
  try {
    logger.debug('Connecting to the database...')
    await db.sync()
    const { body: indiceExists } = await esClient.indices.exists({ index: esIndex })
    if (!indiceExists) await esClient.indices.create({ index: esIndex })
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
      .error('Something went wrong while connecting to the database...')
  }
})()
