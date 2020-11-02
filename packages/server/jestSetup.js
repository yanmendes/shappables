import { Client } from '@elastic/elasticsearch'

import { db } from './src/services'
import { esEndpoint, esIndex } from './src/config'

const esClient = new Client({ node: esEndpoint })
beforeEach(async () => {
  await db.sync()
  const { body: indiceExists } = await esClient.indices.exists({
    index: esIndex
  })
  if (!indiceExists) await esClient.indices.create({ index: esIndex })
})

// TODO: Clean up elasticsearch
afterAll(() => db.close())
