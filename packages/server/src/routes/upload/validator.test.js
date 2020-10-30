import { isInvalidImage } from './validator'

describe('Test image validator', () => {
  it('Should allow upload of files that are images', () => {
    expect(isInvalidImage({
      name: '01.png',
      size: 18337,
      encoding: '7bit',
      tempFilePath: '',
      truncated: false,
      mimetype: 'image/png',
      md5: '947d22f4a5696d17cb6e4c50b1a39da0'
    })).toBe(false)
  })

  it('Should not allow upload of files that are not images', () => {
    expect(isInvalidImage({
      name: '01.csv',
      size: 18337,
      encoding: '7bit',
      tempFilePath: '',
      truncated: false,
      mimetype: 'image/csv',
      md5: '947d22f4a5696d17cb6e4c50b1a39da0'
    })).toMatchObject([
      {
        msg: 'Invalid image format',
        param: 'image',
        location: 'files'
      }
    ])
  })
})
