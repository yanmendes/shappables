module.exports = {
  moduleFileExtensions: ['js'],
  transform: {
    '.js': 'jest-esm-transformer',
  },
  testMatch: ['**/**/*.test.js'],
  testPathIgnorePatterns: ['node_modules', 'src/index.js'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jestSetup.js']
}
