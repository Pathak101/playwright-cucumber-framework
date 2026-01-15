**📌 Introduction**
This repository contains a production-grade UI automation framework built using Playwright + Cucumber (BDD) with a strong focus on:
Reliability (low flakiness)
Speed (parallel execution + auth reuse)
CI/CD readiness (Docker, Jenkins, Azure DevOps)
Debuggability (trace, video, screenshots, Allure)
The framework is designed to scale for enterprise applications and supports PR validation, nightly regression, multi-environment execution, and role-based authentication.

**High-Level Architecture**
┌───────────────┐
│ Feature Files │  (Gherkin)
│  *.feature    │
└───────┬───────┘
        │
        ▼
┌────────────────────┐
│ Cucumber Engine    │
│  - Parallel Exec   │
│  - Retry Logic     │
│  - Tag Filtering  │
└───────┬────────────┘
        │
        ▼
┌──────────────────────────┐
│ Custom World (per worker)│
│  - Browser context       │
│  - storageState login   │
│  - Tracing & Video       │
└───────┬──────────────────┘
        │
        ▼
┌────────────────────┐
│ Page Object Model  │
│  - LoginPage       │
│  - DashboardPage  │
└───────┬────────────┘
        │
        ▼
┌────────────────────┐
│ Playwright Engine  │
│  - Headless CI     │
│  - One browser     │
│    per worker      │
└───────┬────────────┘
        │
        ▼
┌──────────────────────────┐
│ Reporting Layer          │
│  - Allure Results        │
│  - Playwright Trace     │
│  - Video & Screenshots  │
└───────┬──────────────┘
        │
        ▼
┌──────────────────────────┐
│ CI/CD (Dockerized)       │
│  - Jenkins               │
│  - Azure DevOps          │
│  - PR Smoke              │
│  - Nightly Regression    │
└──────────────────────────┘

**📂 Project Structure**
├── src
│   ├── features              # Gherkin feature files
│   ├── steps                 # Step definitions + hooks
│   ├── pages                 # Page Object Model
│   │   ├── base
│   │   ├── auth
│   │   └── dashboard
│   └── support
│       ├── world             # Custom World (Cucumber)
│       ├── auth              # storageState login logic
│       ├── browser           # Browser factory / manager
│       ├── api               # API helpers (hybrid flows)
│       └── config            # Environment config
│
├── reports
│   ├── allure-results
│   ├── allure-report
│   ├── traces
│   └── videos
│
├── Dockerfile
├── Jenkinsfile
├── azure-pipelines.yml
├── cucumber.js
├── package.json
└── README.md

**🧠 Key Design Decisions (Why This Framework Works)**
✅ Why Playwright?

Built-in auto-waiting

Native parallel execution

Reliable locators

First-class trace & video debugging

Much lower flakiness compared to Selenium

✅ Why Cucumber + Playwright?

Business-readable BDD scenarios

Easy collaboration with non-technical stakeholders

Tag-based execution for smoke / regression

Strong fit for large enterprise teams

✅ Custom World (Per Worker Isolation)

Each Cucumber worker gets:

Its own browser instance

Its own browser context

Its own storageState (login session)

This guarantees:

No shared state

No data leakage

Safe parallel execution

**🔐 Authentication Optimization (storageState)**
Problem

Logging in via UI before every scenario:

Slow

Flaky

Redundant

Solution

Login once per worker

Persist cookies + localStorage using storageState

Reuse session for all scenarios in that worker

Result

⏱️ ~60–70% faster execution

🔒 Stable authentication

🚫 No repeated UI login

⚙️ Environment Management

Supported environments:

qa

stage

prod

Configured via:

ENV=qa


Example config:

module.exports = {
  baseUrl,
  browserName,
  isCI
}


Same Docker image runs across environments without code changes.

🚀 Parallel Execution Strategy

Parallelism handled by Cucumber workers

Each worker:

Launches its own browser

Uses its own storageState

Fully CPU-bound → scales horizontally in CI

🧪 Test Categorization
Smoke Tests

Critical paths

Fast feedback

Used for PR validation

Regression Tests

Full coverage

Executed nightly or on main branch

Execution via tags:

@smoke
@regression

🔁 Retry Strategy (Flaky Control)

Retries applied only to tagged flaky scenarios

Prevents masking real bugs

Keeps signal-to-noise ratio high

Example:

@flaky

🔄 API + UI Hybrid Testing

Used to:

Seed test data

Prepare application state

Validate backend + frontend consistency

Benefits:

Faster execution

Reduced UI dependency

Higher reliability

🐳 Dockerized Execution
Why Docker?

Environment consistency

CI-friendly

Easy local + cloud execution

Base Image
mcr.microsoft.com/playwright:v1.57.0-jammy


Includes:

Browsers

OS dependencies

Optimized for CI

🔧 Run Locally (Docker)
docker build -t pw-cucumber .
docker run --rm \
  -e TEST_USER=tomsmith \
  -e TEST_PASS=SuperSecretPassword! \
  -e ENV=qa \
  pw-cucumber

🤖 Jenkins CI Pipeline
Features

Docker-based execution

Branch-aware logic

PR → Smoke tests

Main/Nightly → Regression

Allure reporting with trends

Highlights

Secure credentials via Jenkins Credentials

Artifacts:

Playwright traces

Videos

Allure results

**☁️ Azure DevOps Pipeline**
Capabilities

PR-only smoke optimization

Nightly regression cron

Docker execution

Allure trend history persisted across runs

**📊 Reporting & Debugging**
On Failure Automatically Captured

📸 Screenshot

🎥 Video

🧵 Playwright Trace (ZIP)

**Playwright Trace Includes**

DOM snapshots

Network calls

Console logs

Timeline replay

**📈 Allure Reporting**

Rich HTML reports

History preserved for trend analysis

Useful for:

QA

Developers

Product owners

**🧠 Flakiness Management Philosophy**

We do not hide flaky tests.

Instead we:

Identify patterns via Allure trends

Fix root causes (timing, locators, test data)

Retry only when justified

**🧩 Scalability & Future Enhancements**

Multi-role auth (admin/user)

Visual regression

Accessibility testing

Performance checkpoints

Cloud execution (K8s)

**🧾 Resume-Ready Highlights**

CI-first Playwright framework

Docker + Jenkins + Azure DevOps

Auth reuse with storageState

Parallel, isolated execution

Debug-first design (trace/video)

Allure trend analytics

PR smoke optimization

**🏁 Conclusion**

**This framework is not a demo — it is a real-world, enterprise-ready automation solution designed for:**
**Speed
Stability
Scalability
Maintainability**


