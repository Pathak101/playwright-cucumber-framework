pipeline {
  agent any

  parameters {
    choice(
      name: 'ENV',
      choices: ['qa', 'stage', 'prod'],
      description: 'Target environment'
    )
  }

  triggers {
    // 🌙 Nightly REGRESSION
    cron('H 1 * * *')
  }

  environment {
    TEST_USER = credentials('test-user')
    TEST_PASS = credentials('test-pass')
    ALLURE_HISTORY = 'allure-history'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare Allure History') {
      steps {
        script {
          if (fileExists(ALLURE_HISTORY)) {
            sh 'cp -r allure-history reports/allure-results/history || true'
          }
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t pw-cucumber .'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        script {
          // 🔹 Decide TAGS
          def tags = ''

          if (env.BRANCH_NAME?.startsWith('PR-')) {
            tags = '@smoke'
          } else if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') {
            tags = ''
          } else {
            tags = '@smoke'
          }

          sh """
            docker run --rm \
              -e TEST_USER=${TEST_USER} \
              -e TEST_PASS=${TEST_PASS} \
              -e ENV=${params.ENV} \
              -e CUCUMBER_FILTER_TAGS="${tags}" \
              -v "\$PWD/reports:/app/reports" \
              pw-cucumber
          """
        }
      }
    }
  }

  post {
    always {
      // 📦 Preserve Allure trend history
      sh 'cp -r reports/allure-results/history allure-history || true'

      archiveArtifacts artifacts: 'reports/traces/*.zip', allowEmptyArchive: true
      archiveArtifacts artifacts: 'reports/allure-results/**', allowEmptyArchive: true

      allure([
        reportBuildPolicy: 'ALWAYS',
        results: [[path: 'reports/allure-results']]
      ])
    }
  }
}
