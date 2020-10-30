const destination =
  process.env.NODE_ENV === 'test'
    ? require('fs').createWriteStream('/dev/null')
    : process.stdout

const prettyPrint =
  process.env.NODE_ENV === 'production'
    ? false
    : { levelFirst: true, colorize: true, translateTime: true }

export default require('pino')(
  {
    prettyPrint,
    formatters: {
      level: (label) => {
        return { level: label };
      },
    }
  },
  destination
)