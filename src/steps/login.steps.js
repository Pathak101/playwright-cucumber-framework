const { Given, When, Then } = require('@cucumber/cucumber');

Given('user navigates to login page', async function () {
  await this.loginPage.open(this.baseUrl);
});

When('user logs in with valid credentials', async function () {
  await this.loginPage.login(
    process.env.TEST_USER,
    process.env.TEST_PASS
  );
});

Then('dashboard should be visible', async function () {
  await this.page.waitForURL('**/secure', { timeout: 30000 });
});
