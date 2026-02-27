pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = "upasnarath06"
        IMAGE_BACKEND = "upasna-demo-docker-backend"
        IMAGE_FRONTEND = "upasna-demo-docker-frontend"
        IMAGE_AGENT = "upasna-demo-docker-ai-agent"
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

        stage('Docker Hub Login') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-password', variable: 'DOCKER_PASS')]) {
                    bat '''
                    echo %DOCKER_PASS% | docker login -u %DOCKER_HUB_USER% --password-stdin
                    '''
                }
            }
        }

        stage('Tag Images') {
            steps {
                bat '''
                docker tag upasna-demo-docker-backend %DOCKER_HUB_USER%/%IMAGE_BACKEND%:latest
                docker tag upasna-demo-docker-frontend %DOCKER_HUB_USER%/%IMAGE_FRONTEND%:latest
                docker tag upasna-demo-docker-ai-agent %DOCKER_HUB_USER%/%IMAGE_AGENT%:latest
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                bat '''
                docker push %DOCKER_HUB_USER%/%IMAGE_BACKEND%:latest
                docker push %DOCKER_HUB_USER%/%IMAGE_FRONTEND%:latest
                docker push %DOCKER_HUB_USER%/%IMAGE_AGENT%:latest
                '''
            }
        }

        stage('Deploy Containers') {
            steps {
                bat 'docker-compose down'
                bat 'docker-compose up -d'
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