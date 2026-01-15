require('module-alias/register');

const { Before, After, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

setDefaultTimeout(60 * 1000);

Before(async function () {
  await this.init();

  // ✅ Guard before starting tracing
  if (this.context) {
    await this.context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true
    });
  }
});

After(async function (scenario) {
  try {
    if (!this.context) return;

    if (scenario.result?.status === Status.FAILED) {
      const traceDir = path.join(process.cwd(), 'reports', 'traces');
      fs.mkdirSync(traceDir, { recursive: true });

      const tracePath = path.join(
        traceDir,
        `${scenario.pickle.name.replace(/\s+/g, '_')}.zip`
      );

      await this.context.tracing.stop({ path: tracePath });
    } else {
      await this.context.tracing.stop();
    }
  } catch (err) {
    console.warn('Hook error:', err.message);
  }

  await this.cleanup();
});
