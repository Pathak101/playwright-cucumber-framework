const { When } = require('@cucumber/cucumber');

When('flaky step executes', async function () {
  if (!global.__flakyRanOnce) {
    global.__flakyRanOnce = true;
    throw new Error('Simulated flaky failure');
  }
});
