pipeline {
    agent any

    environment {
        KUBECONFIG = 'C:\\Users\\sreek\\.kube\\config'
        IMAGE_NAME = 'localhost:5000/pwt-eu:latest'
    }

    parameters {
        choice(name: 'ENV', choices: ['qa', 'dev', 'prod'], description: 'Select environment')
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Select browser')
        choice(name: 'WORKERS', choices: ['1', '2', '4'], description: 'Select parallel workers')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Kubernetes') {
            steps {
                bat 'kubectl get nodes'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t pwt-eu .'
            }
        }

        stage('Push Image to Registry') {
            steps {
                bat 'docker tag pwt-eu:latest %IMAGE_NAME%'
                bat 'docker push %IMAGE_NAME%'
            }
        }

        stage('Cleanup Old Kubernetes Jobs') {
            steps {
                bat 'kubectl delete job pwt-eu-smoke-job pwt-eu-regression-job --ignore-not-found=true'
            }
        }

        stage('Run Tests in Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s-playwright-multi-jobs.yaml'
            }
        }

        stage('Wait for Test Completion') {
            steps {
                script {
                    timeout(time: 10, unit: 'MINUTES') {

                        waitUntil {
                            def smokeStatus = bat(
                                script: '@kubectl logs job/pwt-eu-smoke-job | findstr /C:"Smoke execution completed." >nul',
                                returnStatus: true
                            )

                            return smokeStatus == 0
                        }

                        waitUntil {
                            def regressionStatus = bat(
                                script: '@kubectl logs job/pwt-eu-regression-job | findstr /C:"Regression execution completed." >nul',
                                returnStatus: true
                            )

                            return regressionStatus == 0
                        }
                    }
                }
            }
        }

        stage('Collect Blob Reports') {
            steps {
                script {

                    bat 'if exist all-blob-reports rmdir /s /q all-blob-reports'
                    bat 'mkdir all-blob-reports'
                    bat 'mkdir all-blob-reports\\smoke'
                    bat 'mkdir all-blob-reports\\regression'

                    def smokePod = bat(
                        script: '@kubectl get pods -l job-name=pwt-eu-smoke-job -o jsonpath="{.items[0].metadata.name}"',
                        returnStdout: true
                    ).trim()

                    def regressionPod = bat(
                        script: '@kubectl get pods -l job-name=pwt-eu-regression-job -o jsonpath="{.items[0].metadata.name}"',
                        returnStdout: true
                    ).trim()

                    echo "Smoke Pod: ${smokePod}"
                    echo "Regression Pod: ${regressionPod}"

                    bat "kubectl cp ${smokePod}:/app/blob-report all-blob-reports\\smoke"
                    bat "kubectl cp ${regressionPod}:/app/blob-report all-blob-reports\\regression"
                }
            }
        }

        stage('Merge Playwright Reports') {
            steps {
                bat 'if exist merged-blobs rmdir /s /q merged-blobs'
                bat 'mkdir merged-blobs'

                bat 'copy all-blob-reports\\smoke\\*.zip merged-blobs\\'
                bat 'copy all-blob-reports\\regression\\*.zip merged-blobs\\'

                bat 'npx playwright merge-reports --reporter=html merged-blobs'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**/*, all-blob-reports/**/*, merged-blobs/**/*',
                             allowEmptyArchive: true
        }
    }
}