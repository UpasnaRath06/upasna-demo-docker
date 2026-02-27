pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = "upasnarath06"

        LOCAL_BACKEND = "upasna-demo-docker-backend"
        LOCAL_FRONTEND = "upasna-demo-docker-frontend"
        LOCAL_AGENT = "upasna-demo-docker-ai-agent"

        HUB_BACKEND = "upasnarath06/upasna-demo-docker-backend"
        HUB_FRONTEND = "upasnarath06/upasna-demo-docker-frontend"
        HUB_AGENT = "upasnarath06/upasna-demo-docker-ai-agent"
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
                withCredentials([string(credentialsId: 'dockerhub-credentials', variable: 'DOCKER_PASS')]) {
                    bat '''
                    echo %DOCKER_PASS% | docker login -u %DOCKER_HUB_USER% --password-stdin
                    '''
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

        stage('Push Images to Docker Hub') {
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