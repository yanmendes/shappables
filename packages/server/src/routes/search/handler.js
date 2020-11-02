// eslint-disable-next-line
import e from 'express'
import { validationResult } from 'express-validator'
import { Client } from '@elastic/elasticsearch'

import { esEndpoint, esIndex } from '../../config'

/**
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export default (req, res) => {
  const log = req.log

  const { errors } = validationResult(req)
  if (errors.length) {
    log.child({ errors }).warn('Invalid payload')
    return res.status(400).send({ errors })
  }

  const { fileType, description, size, offset = 0 } = req.query
  const esClient = new Client({ node: esEndpoint })
  const paginationSize = 20

  log.debug('Searching for documents in elasticsearch...')
  return esClient
    .search({
      index: esIndex,
      from: offset,
      size: paginationSize + 1,
      body: {
        query: {
          bool: {
            ...(description
              ? {
                  must: [
                    {
                      match: {
                        description: {
                          query: description,
                          fuzziness: 'AUTO'
                        }
                      }
                    }
                  ]
                }
              : {}),
            filter: [
              fileType && { term: { fileType } },
              size && { range: { size: { gte: size * 0.9, lte: size * 1.1 } } }
            ].filter(Boolean)
          }
        }
      }
    })
    .then(({ body }) => body.hits.hits)
    .then((hits = []) =>
      hits.map(({ _source }) => ({
        description: _source.description,
        fileType: _source.fileType,
        name: _source.name,
        size: _source.size,
        url: _source.url
      }))
    )
    .then(hits => {
      if (!hits.length) {
        return res.status(204).send()
      } else if (hits.length <= paginationSize) {
        return res.status(200).send({ images: hits })
      }
      return res.status(200).send({ images: hits.slice(0, -1), hasMore: true })
    })
    .catch(e => {
      log
        .child({ payload: req.body, stack: e.stack, error: e.message })
        .error('Error while searching for images...')
      return res.status(500).json({
        message: 'Something unexpected happened while searching for images',
        errors: e
      })
    })
}
