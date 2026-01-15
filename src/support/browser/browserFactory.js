const { chromium, firefox, webkit } = require('@playwright/test');
const { isCI } = require('../config/env');

const browsers = { chromium, firefox, webkit };

async function launchServer(browserName) {
  return browsers[browserName].launchServer({
    headless: isCI
  });
}

async function connect(wsEndpoint, browserName) {
  return browsers[browserName].connect(wsEndpoint);
}

module.exports = { launchServer, connect };
