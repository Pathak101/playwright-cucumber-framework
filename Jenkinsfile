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

    stage('Docker Build') {
      steps {
        sh 'docker build -t pw-cucumber .'
      }
    }

    stage('Run Playwright Cucumber Tests') {
      steps {
        script {
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

    stage('Generate Cucumber HTML Report') {
      steps {
        sh """
          docker run --rm \
            -v "\$PWD/reports:/app/reports" \
            pw-cucumber npm run report
        """
      }
    }
  }

  post {
    always {
      echo "📦 Archiving reports"
      archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
    }
  }
}
