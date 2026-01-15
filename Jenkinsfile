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
    // 🌙 Nightly regression
    cron('H 1 * * *')
  }

  environment {
    TEST_USER = credentials('test-user')
    TEST_PASS = credentials('test-pass')
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare Allure History') {
      steps {
        sh '''
          mkdir -p reports/allure-results
          if [ -d allure-history ]; then
            echo "📊 Restoring Allure history"
            cp -r allure-history/* reports/allure-results/ || true
          else
            echo "ℹ️ No previous Allure history found"
          fi
        '''
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
          // 🔹 Branch-aware tag logic
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
      sh '''
        mkdir -p allure-history
        if [ -d reports/allure-results/history ]; then
          cp -r reports/allure-results/history/* allure-history/ || true
        fi
      '''

      archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
    }
  }
}
