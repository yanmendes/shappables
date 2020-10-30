module.exports = {
  moduleFileExtensions: ['js'],
  transform: {
    '.js': 'jest-esm-transformer',
  },
  testMatch: ['**/**/*.test.js'],
  testPathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node'
}
