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
    // 🌙 Nightly full regression
    cron('H 1 * * *')
  }

  environment {
    TEST_USER = credentials('test-user')
    TEST_PASS = credentials('test-pass')
    ALLURE_HISTORY_DIR = 'allure-history'
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
          sh '''
            mkdir -p reports/allure-results
            if [ -d "${ALLURE_HISTORY_DIR}" ]; then
              echo "📊 Restoring Allure history"
              cp -r ${ALLURE_HISTORY_DIR}/* reports/allure-results/ || true
            else
              echo "ℹ️ No previous Allure history found"
            fi
          '''
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

          // ✅ Branch-aware tag selection
          def cucumberTags = ''

          // PR build → smoke only
          if (env.CHANGE_ID) {
            cucumberTags = '@smoke'
            echo "🔍 PR detected → running SMOKE tests"
          }
          // Main / nightly → full regression
          else {
            cucumberTags = ''
            echo "🚀 Main/Nightly build → running FULL regression"
          }

          sh """
            docker run --rm \
              -e TEST_USER=${TEST_USER} \
              -e TEST_PASS=${TEST_PASS} \
              -e ENV=${params.ENV} \
              -e CUCUMBER_FILTER_TAGS="${cucumberTags}" \
              -v ${WORKSPACE}/reports:/app/reports \
              pw-cucumber
          """
        }
      }
    }
  }

  post {
    always {

      // 📈 Persist Allure history for trends
      sh '''
        mkdir -p ${ALLURE_HISTORY_DIR}
        if [ -d "reports/allure-results/history" ]; then
          cp -r reports/allure-results/history/* ${ALLURE_HISTORY_DIR}/ || true
        fi
      '''

      // 📦 Archive debugging artifacts
      archiveArtifacts artifacts: 'reports/traces/*.zip', allowEmptyArchive: true
      archiveArtifacts artifacts: 'reports/allure-results/**', allowEmptyArchive: true

      // 📊 Generate Allure report
      allure([
        includeProperties: false,
        reportBuildPolicy: 'ALWAYS',
        results: [[path: 'reports/allure-results']]
      ])
    }
  }
}
