pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = "upasnarath06"

        // Correct local image names created by docker compose
        LOCAL_BACKEND = "docker-project-pipeline-backend"
        LOCAL_FRONTEND = "docker-project-pipeline-frontend"
        LOCAL_AGENT = "docker-project-pipeline-ai-agent"

        // Docker Hub repositories
        HUB_BACKEND = "upasnarath06/docker-project-pipeline-backend"
        HUB_FRONTEND = "upasnarath06/docker-project-pipeline-frontend"
        HUB_AGENT = "upasnarath06/docker-project-pipeline-ai-agent"

        DOCKER_CREDENTIALS_ID = "dockerhub-credentials"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/UpasnaRath06/upasna-demo-docker.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Check Built Images') {
            steps {
                bat 'docker images'
            }
        }

        stage('Docker Hub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: DOCKER_CREDENTIALS_ID,
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS')]) {

                    bat "echo %PASS% | docker login -u %USER% --password-stdin"
                }
            }
        }

        stage('Tag Images') {
            steps {
                bat '''
                docker tag %LOCAL_BACKEND% %HUB_BACKEND%:latest
                docker tag %LOCAL_FRONTEND% %HUB_FRONTEND%:latest
                docker tag %LOCAL_AGENT% %HUB_AGENT%:latest
                '''
            }
        }

        stage('Push Images') {
            steps {
                bat '''
                docker push %HUB_BACKEND%:latest
                docker push %HUB_FRONTEND%:latest
                docker push %HUB_AGENT%:latest
                '''
            }
        }

        stage('Deploy Containers') {
            steps {
                bat 'docker compose down'
                bat 'docker compose up -d'
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline Completed Successfully'
        }
        failure {
            echo '❌ Pipeline Failed'
        }
    }
}