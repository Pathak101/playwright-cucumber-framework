const { chromium } = require('@playwright/test');

let browser;

async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({
      headless: true,              // REQUIRED in Docker / CI
      args: ['--no-sandbox']       // REQUIRED in Docker
    });
  }
  return browser;
}

module.exports = { getBrowser };
