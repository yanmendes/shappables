import { db } from './src/services'

beforeAll(() => db.sync())

// TODO: Clean up elasticsearch
afterAll(() => db.close())
