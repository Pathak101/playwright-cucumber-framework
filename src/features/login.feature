Feature: Login

@smoke
Scenario: Smoke login test
  Given user navigates to login page
  When user logs in with valid credentials
  Then dashboard should be visible

@regression
Scenario: Regression login validation
  Given user navigates to login page
  When user logs in with valid credentials
  Then dashboard should be visible
 

