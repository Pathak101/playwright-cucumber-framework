require('module-alias/register');

const { Given } = require('@cucumber/cucumber');
const { createTestUser } = require('@support/api/apiClient');

Given('user exists via API', async function () {
  this.user = await createTestUser();
});
