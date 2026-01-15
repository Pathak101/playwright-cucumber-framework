class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(url) {
    await this.page.goto(url);
  }

  async click(locator) {
    await locator.click();
  }

  async type(locator, text) {
    await locator.fill(text);
  }

  async waitForVisible(locator) {
    await locator.waitFor({ state: 'visible' });
  }
}

module.exports = BasePage;
