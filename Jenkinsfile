pipeline {
    agent any

    parameters {
        choice(name: 'ENV', choices: ['qa', 'dev', 'prod'], description: 'Select environment')
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Select browser')
        choice(name: 'SUITE', choices: ['all', 'smoke', 'regression', 'e2e'], description: 'Select test suite')
        choice(name: 'WORKERS', choices: ['1', '2', '4'], description: 'Select parallel workers')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browser') {
            steps {
                bat "npx playwright install ${params.BROWSER}"
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def grepOption = ''

                    if (params.SUITE != 'all') {
                        grepOption = "--grep @${params.SUITE}"
                    }

                    withEnv(["ENV=${params.ENV}"]) {
                        bat """
                        npx playwright test --project=${params.BROWSER} ${grepOption} --workers=${params.WORKERS}
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'reports/**/*, results/**/*', allowEmptyArchive: true
        }
    }
}