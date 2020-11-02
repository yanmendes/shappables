import { esEndpoint, esIndex } from '../config'
import { Client } from '@elastic/elasticsearch'

const esClient = new Client({ node: esEndpoint })

export const init = async () => {
  const { body: indiceExists } = await esClient.indices.exists({
    index: esIndex
  })
  if (!indiceExists) {
    await esClient.indices.create({
      index: esIndex,
      body: {
        mappings: {
          properties: {
            id: { type: 'text' },
            name: { type: 'text' },
            description: { type: 'text' },
            fileType: { type: 'keyword' },
            size: { type: 'integer' },
            url: { type: 'text' }
          }
        }
      }
    })
  }
}
