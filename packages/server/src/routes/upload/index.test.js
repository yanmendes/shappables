import request from 'supertest'
import awsSdkMock from 'aws-sdk-mock'

import server from '../../server'

describe('Test POST /upload', () => {

  describe('Happy path', () => {
    beforeEach(() => {
      awsSdkMock.mock('S3', 'putObject', (_, cb) => cb(null, {}))
    })

    afterEach(() => awsSdkMock.restore('S3'))

    it('should return 201 for valid payload', () =>
      request(server)
        .post(`/upload`)
        .attach('image', Buffer.from('some data'), 'photo.png')
        .field('description', 'foo')
        .expect(201))
  })

  describe('Sad paths', () => {
    beforeEach(() => {
      awsSdkMock.mock('S3', 'putObject', (_, cb) => cb(new Error('not ok'), {}))
      awsSdkMock.mock('S3', 'deleteObject', (_, cb) => cb(null, {}))
    })

    afterEach(() => awsSdkMock.restore('S3'))

    it('should return 400 for invalid image types', () =>
      request(server)
        .post(`/upload`)
        .attach('image', Buffer.from('some data'), 'database.csv')
        .field('description', 'foo')
        .expect(400)
        .then(({ body }) =>
          expect(body).toMatchObject({
            errors: [{ msg: 'Invalid image format' }]
          })
        ))

    it('should return 400 for blank description', () =>
      request(server)
        .post(`/upload`)
        .attach('image', Buffer.from('some data'), 'photo.jpg')
        .expect(400)
        .then(({ body }) =>
          expect(body).toMatchObject({
            errors: [{ msg: 'Invalid value' }]
          })
        ))

    it('should delete the image and return 500 if DB fails', () =>
      request(server)
        .post(`/upload`)
        .attach('image', Buffer.from('some data'), 'photo.jpg')
        .field('description', 'foo')
        .expect(500)
    )
  })
})
