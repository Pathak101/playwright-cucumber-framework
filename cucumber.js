require('module-alias/register');

module.exports = {
  default: {
    paths: ['src/features/**/*.feature'],

    require: [
      'src/steps/**/*.js',
      'src/support/**/*.js'
    ],

    parallel: 2,

    retry: 1,
    retryTagFilter: '@flaky',

    format: [
      'progress',
      'json:reports/cucumber/cucumber-results.json'
    ]

    // ❌ REMOVE publishQuiet / --publish-quiet
  }
};
