pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = "upasnarath06"
        IMAGE_BACKEND = "mern-backend"
        IMAGE_FRONTEND = "mern-frontend"
        IMAGE_AGENT = "mern-ai-agent"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/YOUR_GITHUB_USERNAME/mern-todo-devops.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker-compose build'
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
                docker tag mern-todo-devops_backend %DOCKER_HUB_USER%/%IMAGE_BACKEND%:latest
                docker tag mern-todo-devops_frontend %DOCKER_HUB_USER%/%IMAGE_FRONTEND%:latest
                docker tag mern-todo-devops_ai-agent %DOCKER_HUB_USER%/%IMAGE_AGENT%:latest
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