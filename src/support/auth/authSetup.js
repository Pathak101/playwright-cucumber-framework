require('module-alias/register');

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { baseUrl } = require('@support/config/env');

const WORKER_ID = process.env.CUCUMBER_WORKER_ID || '0';
const AUTH_DIR = path.join(process.cwd(), 'storage');
const STORAGE_PATH = path.join(AUTH_DIR, `user-worker-${WORKER_ID}.json`);

async function setupAuth() {
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  if (fs.existsSync(STORAGE_PATH)) {
    return STORAGE_PATH;
  }

  if (!process.env.TEST_USER || !process.env.TEST_PASS) {
    throw new Error('❌ TEST_USER or TEST_PASS env vars are missing');
  }

  console.log(`🔐 Creating login state for worker ${WORKER_ID}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseUrl}/login`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.locator('#username').fill(process.env.TEST_USER);
  await page.locator('#password').fill(process.env.TEST_PASS);
  await page.click('button[type="submit"]');

  // ✅ Correct assertion for herokuapp
  await page.waitForURL('**/secure', { timeout: 30000 });

  await context.storageState({ path: STORAGE_PATH });
  await browser.close();

  return STORAGE_PATH;
}

module.exports = { setupAuth };
