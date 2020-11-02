import { DataTypes, Model } from 'sequelize'

import sequelize from './connection'

export const validFileExtensions = ['image/jpg', 'image/jpeg', 'image/png']

class Image extends Model {}
Image.init({
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING(21)
  },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  fileType: DataTypes.ENUM(validFileExtensions),
  size: DataTypes.INTEGER,
  url: DataTypes.STRING
}, { sequelize, modelName: 'image' });

export default Image
