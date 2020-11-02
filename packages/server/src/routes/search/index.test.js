import request from 'supertest'
import { Client } from '@elastic/elasticsearch'
import { nanoid } from 'nanoid'

import { esEndpoint, esIndex } from '../../config'
import server from '../../server'

describe('Test GET /search', () => {
  describe('Happy path', () => {
    it('should return 204 for empty results', () =>
      request(server)
        .get('/search?fileType=image/jpg')
        .send()
        .expect(204))

    const esClient = new Client({ node: esEndpoint })
    it('should return 200 for description fuzzy search', () =>
      Promise.all(
        Array.from({ length: 21 })
          .map(() => nanoid())
          .map(id => ({
            id,
            name: 'Test.png',
            description: 'Test',
            fileType: 'image/png'
          }))
          .map(({ id, ...image }) =>
            esClient.index({ id, index: esIndex, body: image, refresh: true })
          )
      ).then(() =>
        request(server)
          .get('/search?description=Tst')
          .send()
          .expect(200)
          .then(({ body: { images, hasMore } }) => {
            expect(images.length).toBe(20)
            expect(images[0]).toMatchObject({
              name: 'Test.png',
              description: 'Test',
              fileType: 'image/png'
            })
            expect(hasMore).toBe(true)
          })
      ))

    it('should return 200 and hasMore for type search with more than 20 instances', () =>
      Promise.all(
        Array.from({ length: 21 })
          .map(() => nanoid())
          .map(id => ({
            id,
            name: 'Test.png',
            description: 'Test',
            fileType: 'image/png'
          }))
          .map(({ id, ...image }) =>
            esClient.index({ id, index: esIndex, body: image, refresh: true })
          )
      ).then(() =>
        request(server)
          .get('/search?fileType=image/png')
          .send()
          .expect(200)
          .then(({ body: { images, hasMore } }) => {
            expect(images.length).toBe(20)
            expect(images[0]).toMatchObject({
              name: 'Test.png',
              description: 'Test',
              fileType: 'image/png'
            })
            expect(hasMore).toBe(true)
          })
      ))

    it('should return 200 for size searches with 10% size diff', () =>
      Promise.all(
        Array.from({ length: 21 })
          .map(() => nanoid())
          .map(id => ({
            id,
            name: 'Test.png',
            description: 'Test',
            fileType: 'image/png',
            size: 321
          }))
          .map(({ id, ...image }) =>
            esClient.index({ id, index: esIndex, body: image, refresh: true })
          )
      ).then(() =>
        request(server)
          .get('/search?size=340')
          .send()
          .expect(200)
          .then(({ body: { images, hasMore } }) => {
            expect(images.length).toBe(20)
            expect(images[0]).toMatchObject({
              name: 'Test.png',
              description: 'Test',
              fileType: 'image/png',
              size: 321
            })
            expect(hasMore).toBe(true)
          })
      ))
  })

  describe('Sad paths', () => {
    it('should return 400 for invalid image types', () =>
      request(server)
        .get(`/search?fileType=foo`)
        .send()
        .expect(400)
        .then(({ body }) =>
          expect(body).toMatchObject({
            errors: [{ msg: 'Invalid image type' }]
          })
        ))

    it('should return 400 for files larger than 500kb', () =>
      request(server)
        .get(`/search?size=513000`)
        .send()
        .expect(400)
        .then(({ body }) =>
          expect(body).toMatchObject({
            errors: [{ param: 'size' }]
          })
        ))

    it('should return 400 for negative offsets', () =>
      request(server)
        .get(`/search?offset=-1`)
        .send()
        .expect(400)
        .then(({ body }) =>
          expect(body).toMatchObject({
            errors: [{ param: 'offset' }]
          })
        ))
  })
})
