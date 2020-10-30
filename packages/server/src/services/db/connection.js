import { Sequelize } from 'sequelize'
import { dbUri, env } from '../../config'

export default new Sequelize(env === 'prod' ? dbUri : 'sqlite::memory:')
