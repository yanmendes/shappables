import request from 'supertest'

import server from '../../../server'
import invalidPayloadMock from './__mocks__/invalidPayload'
import validPayloadMock from './__mocks__/validPayload'
import invalidPayloadAssertion from './__assertions__/invalidPayload'
import validPayloadAssertionDb from './__assertions__/validPayloadAssertionDb'
import validPayloadAssertionPublisher from './__assertions__/validPayloadAssertionPublisher'

jest.mock('../../../services/pubsub/publisher')
jest.spyOn(publisher, 'publish')

describe('test POST /upload', () => {
  beforeAll(() => Client.create({ _id: validPayloadMock.clientId }))

  afterAll(() =>
    Promise.all([Client.deleteMany({}), Transaction.deleteMany({})])
  )

  it('should return 400 for invalid payloads', () =>
    request(server)
      .post(`/transaction`)
      .send(invalidPayloadMock)
      .expect(400)
      .then(({ body }) => expect(body).toMatchObject(invalidPayloadAssertion)))

  it('should persist the transaction, generate payable and return 200 for invalid payloads', () =>
    request(server)
      .post(`/transaction`)
      .send(validPayloadMock)
      .expect(201)
      .then(() =>
        Transaction.findOne({ clientId: validPayloadMock.clientId })
          .then(t =>
            expect(t.toObject()).toMatchObject(validPayloadAssertionDb)
          )
          .then(() =>
            expect(publisher.publish).toHaveBeenCalledWith(
              ...validPayloadAssertionPublisher
            )
          )
      ))
})
