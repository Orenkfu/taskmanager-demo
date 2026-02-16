# Task Manager Demo

A simple Task Management API built with NestJS, containerized with Docker, and deployed to AWS EC2 using Terraform and GitHub Actions.  
This project demonstrates backend development, testing, infrastructure-as-code, and a basic CI/CD pipeline.

---

## Overview

The service exposes a minimal REST API for managing tasks, along with a health endpoint suitable for load balancers and monitoring. The application is packaged as a Docker image and deployed to AWS using a fully automated pipeline.

This project was built as a take-home style exercise, focusing on correctness, clarity, and reproducibility rather than production-scale complexity.

---

## API

### Endpoints

**GET /tasks**  
Returns all tasks.

**POST /tasks**  
Creates a new task.

Example request:
```json
{
  "title": "Buy milk",
  "status": "todo"
}
```

**GET /health**
Readiness endpoint for monitoring and load balancers.

---

## Architecture

The system consists of:

* A NestJS API running inside a Docker container

* Amazon ECR for container image storage

* A single EC2 instance running the container

* Terraform for provisioning infrastructure

* GitHub Actions for CI/CD

* AWS Systems Manager (SSM) for deployment (no SSH access required)

This architecture is intentionally simple and single-node to keep the focus on core concepts.

---

## Infrastructure & Deployment
### High-Level Flow

On every deployment:

1. GitHub Actions runs unit tests.

2. A Docker image is built and pushed to Amazon ECR.

3. The EC2 instance pulls the new image via AWS SSM.

4. The running container is replaced.

5. A local /health check is performed to verify the deployment.

---

## Why AWS SSM Instead of SSH

The EC2 instance is managed using AWS Systems Manager rather than SSH:

* No inbound SSH port (22) is exposed.
* No SSH keys are stored in GitHub secrets.
* Access is controlled via IAM roles.
* All commands and logs are auditable through AWS.

This is more secure and simpler to operate for automated deployments.

---

## Network Security

Inbound traffic

* Port 80 is open to allow HTTP access to the API.
* No administrative ports are exposed.

Outbound traffic

Open egress is required to allow:

* SSM agent communication with AWS APIs
* Docker image pulls from ECR
* Package installation during instance bootstrapping

## IAM Model

The EC2 instance uses an IAM role that allows:

* Pulling images from ECR
* Being managed via SSM

 GitHub Actions uses separate AWS credentials with permission to:

* Push images to ECR
* Trigger SSM Run Command for deployment

This separation ensures the instance itself does not have deployment privileges.

---

## Instance Bootstrapping

On first boot, the EC2 instance installs:

* Docker
* AWS CLI
* Amazon SSM Agent

This is done via user_data so the instance is fully reproducible using Terraform alone.
--- 

## Terraform Notes

* The default VPC and subnet are used for simplicity.
* The Ubuntu 22.04 AMI is selected dynamically (latest matching image).
* In production, AMIs would typically be pinned or baked via an image pipeline.
* The system runs on a single EC2 instance (no load balancer or autoscaling).

These choices are deliberate tradeoffs for a take-home style project.

---

## Testing

* Unit tests are written with Jest.
* Business logic is tested in isolation with mocked repositories.
* Coverage thresholds are enforced (≥ 80%).
* The focus is on validating application behavior rather than framework internals.

---

## Scalability (Discussion)

If traffic increased significantly, the following changes would be made:

* Replace the single EC2 instance with:
* An Auto Scaling Group or ECS/Fargate
* An Application Load Balancer
* Move persistence to a real database (e.g., RDS or DynamoDB)
* Introduce versioned container deployments (no :latest)
* Add rolling or blue/green deployments
* Add caching for frequently accessed data

The current architecture is not horizontally scalable by design.

---

## Observability (Discussion)

* In a production environment, observability would be extended with:
* Centralized log aggregation (e.g., CloudWatch Logs, ELK, Datadog)

#### Metrics for:

* Request latency
* Error rates
* Health check failures
* Distributed tracing (OpenTelemetry)

#### Alerting on:

* Deployment failures
* Health endpoint failures
* Elevated error rates

## Limitations

This project intentionally omits:

* Persistent storage
* Authentication and authorization
* TLS termination
* Load balancing
* Zero-downtime deployments

These are outside the scope of the exercise but would be required in a production system.

## Local Development
```
cd tm-api
npm install
npm test
npm run start:dev
```