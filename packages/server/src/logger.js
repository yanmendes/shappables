const destination =
  process.env.NODE_ENV === 'test'
    ? require('fs').createWriteStream('/dev/null')
    : process.stdout

const prettyPrint =
  process.env.NODE_ENV === 'prod'
    ? false
    : { levelFirst: true, colorize: true, translateTime: true }

export default require('pino')(
  {
    prettyPrint,
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
      level: label => {
        return { level: label }
      }
    }
  },
  destination
)
