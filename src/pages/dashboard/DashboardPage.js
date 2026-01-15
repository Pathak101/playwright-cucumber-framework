const path = require('path');
const BasePage = require(path.join(process.cwd(), 'src/pages/base/BasePage'));

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.successMessage = page.locator('#flash');
  }

  async isLoaded() {
    await this.successMessage.waitFor({ state: 'visible' });
    return true;
  }
}

module.exports = DashboardPage;
