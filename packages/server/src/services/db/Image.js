import { Model, DataTypes } from 'sequelize'

import sequelize from './connection'

export const validFileExtensions = ['image/jpg', 'image/jpeg', 'image/png']

class Image extends Model {}
Image.init({
  url: DataTypes.STRING,
  description: DataTypes.STRING,
  fileType: DataTypes.ENUM(validFileExtensions),
  size: DataTypes.NUMBER
}, { sequelize, modelName: 'image' });

export default Image
