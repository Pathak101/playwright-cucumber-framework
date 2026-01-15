require('module-alias/register');

const { request } = require('@playwright/test');
const { baseUrl } = require('@support/config/env');

async function createTestUser() {
  const api = await request.newContext({ baseURL: baseUrl });

  const response = await api.post('/api/users', {
    data: { name: 'api-user' }
  });

  return response.json();
}

module.exports = { createTestUser };
