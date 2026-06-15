module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  setupFiles: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/vendor/**',
    '!node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov'],
};
