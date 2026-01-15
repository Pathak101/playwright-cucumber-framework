const BasePage = require('@pages/base/BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.username = page.locator('#username');
    this.password = page.locator('#password');
    this.loginBtn = page.locator('button[type="submit"]');
  }

  async open(baseUrl) {
    await this.page.goto(`${baseUrl}/login`, { waitUntil: 'load' });
  }

  async login(user, pass) {
    await this.username.waitFor({ state: 'visible', timeout: 30000 });
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginBtn.click();
  }
}

module.exports = LoginPage;
