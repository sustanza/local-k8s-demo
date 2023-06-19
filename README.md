# local-k8s-demo

## 📝 Objectives

Create a simple project that highlights a basic development environment with k8s. 

- [x] Monorepo
- [x] Web Application / API
- [x] Worker Service
- [x] Database
- [x] Queue
- [x] Event based auto scaling

*This project is a POC and not intended for production use*

What this project is not intended to provide:

- A set of best practices for k8s development/deployment
- A set of best practices for event driven architecture
- High quality code or testing

## 💻 Tech Stack

- [TypeScript](https://www.typescriptlang.org)
- [RancherDesktop](https://rancherdesktop.io)
- [NextJS](https://nextjs.org)
- [Prisma](https://www.prisma.io/)
- [Tilt](https://tilt.dev)
- [TurboRepo](https://turbo.build)
- [Kubegres](https://kubegres.io)
- [RabbitMQ](https://www.rabbitmq.com)
- [Keda](https://keda.sh)

[![IMAGE ALT TEXT](http://img.youtube.com/vi/Nj55RDVwrIE/0.jpg)](http://www.youtube.com/watch?v=Nj55RDVwrIE "Local K8S Development")

## 🏗️ Setup

This application can run entirely in containers on k8s. We first need to setup the basic system prerequisites.

### ⚙️ System Prerequisites

- Install NodeJS - Recommended via [ASDF](https://asdf-vm.com)
  - This is not entirely necessary, but it is helpful being able to interact with the project locally.
- Install [Rancher Desktop](https://rancherdesktop.io)
- Enable Kubernetes in Rancher Desktop
- Install [Tilt](https://tilt.dev)

### 🌎 Environment Variables

- This application is geared towards using environment variables for configurations and secrets. All custom values can be set in a `.env` file set in the `/k8s/secrets` directory
    - Update `.env.k8s.example` to `.env.k8s` with the desired values you need. By default the only values in here are specific to setting the default database password.

- The queue ([RabbitMQ](https://www.rabbitmq.com)) sets the default user/password values as part of the default behavior of the operator. Those can be found in the `queue-default-user` secret on the k8s cluster once a queue service has been deployed.
- The baseline configuration for the application to run locally is stored in the root of the project in an `.env` file. This is for running the project just using Turborepo and not within something like k8s. Review the `.env.example` in the root directory to reference the required variables.

## 🛠️ K8S Cluster Setup

#### Once k8s is up and running we have to install some k8s [operators](https://kubernetes.io/docs/concepts/extend-kubernetes/operator)

#### Postgresql

```shell
kubectl apply -f "https://raw.githubusercontent.com/reactive-tech/kubegres/v1.16/kubegres.yaml"
```

#### RabbitMQ

```shell
kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"
```

##### Keda

```shell
kubectl apply -f "https://github.com/kedacore/keda/releases/download/v2.9.0/keda-2.9.0.yaml"
```

### Database Setup

```shell
prisma migrate dev
```

### 💡 k8s Helpful Commands

#### Clean up images and restore space

```bash
nerdctl -n "k8s.io" system prune -a
```