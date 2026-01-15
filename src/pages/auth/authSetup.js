const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');
const { baseUrl } = require('../config/env');

const AUTH_DIR = path.join(process.cwd(), 'storage');
const AUTH_FILE = path.join(AUTH_DIR, 'auth.json');

async function setupAuth() {
  if (fs.existsSync(AUTH_FILE)) return AUTH_FILE;

  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseUrl}/login`);
  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type="submit"]');
  await page.waitForSelector('#flash');

  await context.storageState({ path: AUTH_FILE });

  await browser.close();
  return AUTH_FILE;
}

module.exports = { setupAuth };
