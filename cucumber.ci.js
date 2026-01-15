require('module-alias/register');

module.exports = {
  default: {
    paths: ['src/features/**/*.feature'],
    require: [
      'src/steps/**/*.js',
      'src/support/**/*.js'
    ],
    parallel: 4,
    retry: 1,
    retryTagFilter: '@flaky',
    publishQuiet: true,
    timeout: 60000 // ⏱ 60 seconds per step
  }
};
