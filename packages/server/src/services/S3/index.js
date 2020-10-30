import { S3 } from 'aws-sdk'
import { bucketName } from '../../config'

const uploadFile = () => S3.ManagedUpload()

const deleteFile = () => S3.ManagedUpload()

export default { uploadFile, deleteFile }
