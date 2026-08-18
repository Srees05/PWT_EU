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