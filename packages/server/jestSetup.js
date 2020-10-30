import { db } from './src/services'

beforeAll(() => db.sync())

afterAll(() => db.close())
