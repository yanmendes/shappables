export const env = process.env.NODE_ENV || 'dev'
export const port = process.env.PORT || '3000'
export const dbUri = process.env.DB_URI
export const imageBucket = process.env.IMAGE_BUCKET || 'shappables-image-bucket'
export const esEndpoint = process.env.ES_ENDPOINT || 'http://localhost:9200'
export const esIndex = process.env.ES_INDEX || 'shappable-images'
export const maxFileSize = 500 * 1024
