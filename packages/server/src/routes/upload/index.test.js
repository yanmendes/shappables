import request from 'supertest'

import server from '../../server'

describe('test POST /upload', () => {
  jest.mock('aws-sdk', () => ({
    S3: jest.fn(() => ({
      putObject: jest.fn((_, cb) => cb(null, 'data')),
      deleteObject: jest.fn()
    }))
  }))

  afterEach(() => jest.clearAllMocks())

  it('should return 201 for valid payload', () =>
    request(server)
      .post(`/upload`)
      .attach('image', Buffer.from('some data'), 'photo.png')
      .field('description', 'foo')
      .expect(201))

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

  it('should delete the image and return 500 if DB fails', () => {
    // jest.mock('../../services/db/Image', () => ({
    //   create: jest.fn(() => Promise.reject(Error))
    // }))
    // return request(server)
    //   .post(`/upload`)
    //   .attach('image', Buffer.from('some data'), 'photo.jpg')
    //   .field('description', 'foo')
    //   .expect(500)
  })
})
