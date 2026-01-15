module.exports = {
  default: {
    require: [
      "src/steps/**/*.js",
      "src/support/**/*.js"
    ],
    format: [
      "progress",
      "json:reports/cucumber/cucumber-report.json"
    ],
    publishQuiet: true
  }
};
