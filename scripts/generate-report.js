const reporter = require("cucumber-html-reporter");

const options = {
  theme: "bootstrap",
  jsonFile: "reports/cucumber/cucumber-report.json",
  output: "reports/cucumber/cucumber-report.html",
  reportSuiteAsScenarios: true,
  launchReport: false,
  metadata: {
    "Test Environment": process.env.ENV || "qa",
    "Browser": "Chromium",
    "Platform": "Docker"
  }
};

reporter.generate(options);
