pipeline {
    agent any

    environment {
        KUBECONFIG = 'C:\\Users\\sreek\\.kube\\config'
        IMAGE_NAME = 'localhost:5000/pwt-eu:latest'
    }

    parameters {

        choice(
            name: 'ENV',
            choices: ['qa', 'dev', 'prod'],
            description: 'Select environment'
        )

        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Select browser'
        )

        choice(
            name: 'WORKERS',
            choices: ['1', '2', '4'],
            description: 'Select parallel workers'
        )
    }


    stages {

        // =====================================================
        // 1. CHECKOUT
        // =====================================================

        stage('Checkout') {
            steps {
                checkout scm
            }
        }


        // =====================================================
        // 2. VERIFY KUBERNETES
        // =====================================================

        stage('Verify Kubernetes') {
            steps {

                bat 'kubectl get nodes'

            }
        }


        // =====================================================
        // 3. BUILD DOCKER IMAGE
        // =====================================================

        stage('Build Docker Image') {
            steps {

                bat 'docker build -t pwt-eu .'

            }
        }


        // =====================================================
        // 4. PUSH IMAGE TO LOCAL REGISTRY
        // =====================================================

        stage('Push Image to Registry') {
            steps {

                bat 'docker tag pwt-eu:latest %IMAGE_NAME%'

                bat 'docker push %IMAGE_NAME%'

            }
        }


        // =====================================================
        // 5. DELETE OLD KUBERNETES JOBS
        // =====================================================

        stage('Cleanup Old Kubernetes Jobs') {
            steps {

                bat '''
                kubectl delete job pwt-eu-smoke-job pwt-eu-regression-job --ignore-not-found=true
                '''

            }
        }


        // =====================================================
        // 6. GENERATE RUNTIME KUBERNETES YAML
        // =====================================================

        stage('Prepare Kubernetes Config') {
            steps {

                powershell """
                (Get-Content k8s-playwright-multi-jobs.yaml) `
                -replace '__ENV__', '${params.ENV}' `
                -replace '__BROWSER__', '${params.BROWSER}' `
                -replace '__WORKERS__', '${params.WORKERS}' |
                Set-Content k8s-playwright-runtime.yaml
                """

                echo "Environment : ${params.ENV}"
                echo "Browser     : ${params.BROWSER}"
                echo "Workers     : ${params.WORKERS}"
            }
        }


        // =====================================================
        // 7. RUN PLAYWRIGHT IN KUBERNETES
        // =====================================================

        stage('Run Tests in Kubernetes') {
            steps {

                bat 'kubectl apply -f k8s-playwright-runtime.yaml'

            }
        }


        // =====================================================
        // 8. WAIT FOR PLAYWRIGHT EXECUTION
        // =====================================================

        stage('Wait for Test Completion') {

            steps {

                script {

                    timeout(
                        time: 15,
                        unit: 'MINUTES'
                    ) {

                        waitUntil {

                            def smokeStatus = bat(
                                script:
                                '@kubectl logs job/pwt-eu-smoke-job | findstr /C:"Smoke execution completed." >nul',
                                returnStatus: true
                            )

                            return smokeStatus == 0
                        }


                        waitUntil {

                            def regressionStatus = bat(
                                script:
                                '@kubectl logs job/pwt-eu-regression-job | findstr /C:"Regression execution completed." >nul',
                                returnStatus: true
                            )

                            return regressionStatus == 0
                        }
                    }
                }
            }
        }


        // =====================================================
        // 9. COLLECT PLAYWRIGHT BLOB REPORTS
        // =====================================================

        stage('Collect Blob Reports') {

            steps {

                script {

                    bat '''
                    if exist all-blob-reports rmdir /s /q all-blob-reports

                    mkdir all-blob-reports
                    mkdir all-blob-reports\\smoke
                    mkdir all-blob-reports\\regression
                    '''


                    def smokePod = bat(
                        script:
                        '@kubectl get pods -l job-name=pwt-eu-smoke-job -o jsonpath="{.items[0].metadata.name}"',
                        returnStdout: true
                    ).trim()


                    def regressionPod = bat(
                        script:
                        '@kubectl get pods -l job-name=pwt-eu-regression-job -o jsonpath="{.items[0].metadata.name}"',
                        returnStdout: true
                    ).trim()


                    echo "Smoke Pod     : ${smokePod}"
                    echo "Regression Pod: ${regressionPod}"


                    bat """
                    kubectl cp ${smokePod}:/app/blob-report all-blob-reports\\smoke
                    """


                    bat """
                    kubectl cp ${regressionPod}:/app/blob-report all-blob-reports\\regression
                    """
                }
            }
        }


        // =====================================================
        // 10. COLLECT AGENTIC AI RCA REPORTS
        // =====================================================

        stage('Collect Agentic AI Reports') {

            steps {

                script {

                    bat '''
                    if exist agentic-ai-reports rmdir /s /q agentic-ai-reports

                    mkdir agentic-ai-reports
                    mkdir agentic-ai-reports\\smoke
                    mkdir agentic-ai-reports\\regression
                    '''


                    def smokePod = bat(
                        script:
                        '@kubectl get pods -l job-name=pwt-eu-smoke-job -o jsonpath="{.items[0].metadata.name}"',
                        returnStdout: true
                    ).trim()


                    def regressionPod = bat(
                        script:
                        '@kubectl get pods -l job-name=pwt-eu-regression-job -o jsonpath="{.items[0].metadata.name}"',
                        returnStdout: true
                    ).trim()


                    // -------------------------------------------------
                    // AI reports are optional.
                    //
                    // If all tests PASS, the directory may not exist.
                    // Jenkins must NOT fail because of that.
                    // -------------------------------------------------

                    def smokeAIExists = bat(
                        script:
                        "@kubectl exec ${smokePod} -- test -d /app/reports/agentic-ai-analysis",
                        returnStatus: true
                    )


                    if (smokeAIExists == 0) {

                        echo 'Smoke Agentic AI RCA found.'

                        bat """
                        kubectl cp ${smokePod}:/app/reports/agentic-ai-analysis agentic-ai-reports\\smoke
                        """

                    } else {

                        echo 'No Smoke Agentic AI RCA generated.'
                    }


                    def regressionAIExists = bat(
                        script:
                        "@kubectl exec ${regressionPod} -- test -d /app/reports/agentic-ai-analysis",
                        returnStatus: true
                    )


                    if (regressionAIExists == 0) {

                        echo 'Regression Agentic AI RCA found.'

                        bat """
                        kubectl cp ${regressionPod}:/app/reports/agentic-ai-analysis agentic-ai-reports\\regression
                        """

                    } else {

                        echo 'No Regression Agentic AI RCA generated.'
                    }
                }
            }
        }


        // =====================================================
        // 11. MERGE PLAYWRIGHT REPORTS
        // =====================================================

        stage('Merge Playwright Reports') {

            steps {

                bat '''
                if exist merged-blobs rmdir /s /q merged-blobs

                mkdir merged-blobs
                '''


                bat '''
                copy all-blob-reports\\smoke\\*.zip merged-blobs\\
                '''


                bat '''
                copy all-blob-reports\\regression\\*.zip merged-blobs\\
                '''


                bat '''
                npx playwright merge-reports --reporter=html merged-blobs
                '''
            }
        }


        // =====================================================
        // 12. VALIDATE KUBERNETES TEST RESULTS
        // =====================================================

        stage('Validate Test Results') {

            steps {

                script {

                    // Allow Kubernetes jobs to leave the
                    // temporary artifact collection window.

                    sleep(
                        time: 30,
                        unit: 'SECONDS'
                    )


                    def smokeComplete = bat(
                        script:
                        '@kubectl get job pwt-eu-smoke-job -o jsonpath="{.status.succeeded}"',
                        returnStdout: true
                    ).trim()


                    def smokeFailed = bat(
                        script:
                        '@kubectl get job pwt-eu-smoke-job -o jsonpath="{.status.failed}"',
                        returnStdout: true
                    ).trim()


                    def regressionComplete = bat(
                        script:
                        '@kubectl get job pwt-eu-regression-job -o jsonpath="{.status.succeeded}"',
                        returnStdout: true
                    ).trim()


                    def regressionFailed = bat(
                        script:
                        '@kubectl get job pwt-eu-regression-job -o jsonpath="{.status.failed}"',
                        returnStdout: true
                    ).trim()


                    echo "Smoke succeeded      : ${smokeComplete}"
                    echo "Smoke failed         : ${smokeFailed}"

                    echo "Regression succeeded : ${regressionComplete}"
                    echo "Regression failed    : ${regressionFailed}"


                    if (
                        smokeFailed == '1' ||
                        regressionFailed == '1'
                    ) {

                        error(
                            'Playwright test execution failed in Kubernetes.'
                        )
                    }


                    if (
                        smokeComplete != '1' ||
                        regressionComplete != '1'
                    ) {

                        error(
                            'Kubernetes jobs did not complete successfully.'
                        )
                    }


                    echo 'Smoke and Regression suites PASSED.'
                }
            }
        }
    }


    // =========================================================
    // POST BUILD ACTIONS
    // =========================================================

    post {

        always {

            // -------------------------------------------------
            // Archive Playwright + Agentic AI artifacts
            // -------------------------------------------------

            archiveArtifacts(
                artifacts:
                'playwright-report/**/*, ' +
                'all-blob-reports/**/*, ' +
                'merged-blobs/**/*, ' +
                'agentic-ai-reports/**/*',
                allowEmptyArchive: true
            )


            // -------------------------------------------------
            // Publish merged Playwright HTML report
            // -------------------------------------------------

            publishHTML([

                reportDir:
                    'playwright-report',

                reportFiles:
                    'index.html',

                reportName:
                    'Playwright HTML Report',

                keepAll:
                    true,

                alwaysLinkToLastBuild:
                    true,

                allowMissing:
                    true
            ])


            // -------------------------------------------------
            // Kubernetes Cleanup
            // -------------------------------------------------

            echo 'Cleaning Kubernetes Jobs...'


            bat '''
            kubectl delete job pwt-eu-smoke-job pwt-eu-regression-job --ignore-not-found=true
            '''


            echo 'Kubernetes cleanup completed.'
        }
    }
}