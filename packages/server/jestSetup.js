import { db, elasticsearch } from './src/services'

beforeAll(async () => db.sync().then(() => elasticsearch.init()))

// TODO: Clean up elasticsearch
afterAll(() => db.close())
