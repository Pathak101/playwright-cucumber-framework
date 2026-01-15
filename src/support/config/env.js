// ✅ REQUIRED FIX
require('dotenv').config();

const ENV = process.env.ENV || 'qa';

const environments = {
  qa: {
    baseUrl: 'https://the-internet.herokuapp.com'
  },
  stage: {
    baseUrl: 'https://stage.example.com'
  },
  prod: {
    baseUrl: 'https://prod.example.com'
  }
};

if (!environments[ENV]) {
  throw new Error(`❌ Invalid ENV value: ${ENV}`);
}

module.exports = {
  env: ENV,
  baseUrl: environments[ENV].baseUrl,
  browserName: process.env.BROWSER || 'chromium',
  isCI: process.env.CI === 'true'
};
