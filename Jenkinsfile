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

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t pwt-eu .'
            }
        }

        stage('Run Tests in Docker') {
            steps {
                script {
                    def grepOption = ''

                    if (params.SUITE != 'all') {
                        grepOption = "--grep @${params.SUITE}"
                    }

                    bat """
                    docker run --rm ^
                    -e ENV=${params.ENV} ^
                    -v "%CD%\\reports:/app/reports" ^
                    -v "%CD%\\results:/app/results" ^
                    pwt-eu ^
                    npx playwright test ^
                    --project=${params.BROWSER} ^
                    ${grepOption} ^
                    --workers=${params.WORKERS}
                    """
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