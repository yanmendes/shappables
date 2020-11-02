export const env = process.env.NODE_ENV || 'dev'
export const port = process.env.PORT || '3000'
export const dbUri = process.env.DB_URI
export const imageBucket = process.env.IMAGE_BUCKET || 'shappables-image-bucket'
export const imageBucketEndpoint = process.env.IMAGE_BUCKET_ENDPOINT || `https://${imageBucket}.s3-sa-east-1.amazonaws.com`
export const esEndpoint = process.env.ES_ENDPOINT || 'http://localhost:9200'
export const esIndex = process.env.NODE_ENV === 'test'
  ? 'shappable-images-test'
  : 'shappable-images'
export const maxFileSize = 500 * 1024
