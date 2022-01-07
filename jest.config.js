module.exports = {
  testURL: 'https://wallet.parami.io',
  testEnvironment: './tests/PuppeteerEnvironment',
  verbose: false,
  setupFilesAfterEnv: ['./tests/setupTests.js'],
  testTimeout: 60000,
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: false,
    localStorage: null,
  },
};
