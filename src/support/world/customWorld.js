require('module-alias/register');

const { setWorldConstructor } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('playwright');

const { baseUrl, browserName } = require('@support/config/env');
const { setupAuth } = require('@support/auth/authSetup');
const LoginPage = require('@pages/auth/LoginPage');

class CustomWorld {
  async init() {
    const storageState = await setupAuth();

    const browserType =
      browserName === 'firefox'
        ? firefox
        : browserName === 'webkit'
        ? webkit
        : chromium;

    this.browser = await browserType.launch({
      headless: true
    });

    this.context = await this.browser.newContext({
      storageState
    });

    this.page = await this.context.newPage();

    // ✅ Initialize page objects
    this.loginPage = new LoginPage(this.page);

    this.baseUrl = baseUrl;
  }

  async cleanup() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);
