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
            docker rm -f pwt-eu-run 2>nul || exit /b 0

            docker run --name pwt-eu-run ^
            -e ENV=${params.ENV} ^
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
        bat 'docker cp pwt-eu-run:/app/reports ./reports || exit /b 0'
        bat 'docker cp pwt-eu-run:/app/results ./results || exit /b 0'
        bat 'docker rm -f pwt-eu-run || exit /b 0'

        archiveArtifacts artifacts: 'reports/**/*, results/**/*',
                         allowEmptyArchive: true
    }
}
}