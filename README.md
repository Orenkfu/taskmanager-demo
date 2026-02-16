# Task Manager Demo

A Task Management REST API built with NestJS, containerized with Docker, and deployed to AWS EC2 using Terraform and GitHub Actions.
This project demonstrates backend development, unit testing, infrastructure-as-code, and a basic CI/CD pipeline.

## Overview

The service exposes a minimal REST API for managing tasks, along with a health endpoint suitable for load balancers and monitoring. The application is packaged as a Docker image and deployed to AWS using a fully automated pipeline.

This project was built as a technical excercise, focusing on correctness, clarity, and reproducibility rather than production-scale complexity.

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

## Architecture

The system consists of:

* A NestJS API running inside a Docker container
* Amazon ECR for container image storage
* A single EC2 instance running the container
* Terraform for provisioning infrastructure
* GitHub Actions for CI/CD
* AWS Systems Manager (SSM) for deployment (no SSH access required)

This architecture is intentionally simple and single-node to keep the focus on core concepts.

## Infrastructure & Deployment
### High-Level Flow

On every deployment:

1. GitHub Actions runs unit tests.
2. A Docker image is built and pushed to Amazon ECR.
3. The EC2 instance pulls the new image via AWS SSM.
4. The running container is replaced.
5. A local /health check is performed to verify the deployment.

## Why AWS SSM Instead of SSH

The EC2 instance is managed using AWS Systems Manager rather than SSH:

* No inbound SSH port (22) is exposed.
* No SSH keys are stored in GitHub secrets.
* Access is controlled via IAM roles.
* All commands and logs are auditable through AWS.

This is more secure and simpler to operate for automated deployments.

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

## Instance Bootstrapping

On first boot, the EC2 instance installs:

* Docker
* AWS CLI
* Amazon SSM Agent

This is done via user_data so the instance is fully reproducible using Terraform alone.

## Terraform Notes

* The default VPC and subnet are used for simplicity.
* The Ubuntu 22.04 AMI is selected dynamically (latest matching image).
* In production, AMIs would typically be pinned or baked via an image pipeline.
* The system runs on a single EC2 instance (no load balancer or autoscaling).

These choices are deliberate tradeoffs for a technical excercise.

## Testing

* Unit tests are written with Jest.
* Business logic is tested in isolation with mocked repositories.
* Coverage thresholds are enforced (≥ 80%).
* The focus is on validating application behavior rather than framework internals.

## Scalability (Discussion)

If traffic increased significantly, the following changes would be made:

* Compute: Move from a single EC2 instance to a managed container platform behind an ALB with autoscaling.
    This could be ECS/Fargate for a simpler AWS-native model, or EKS if standard Kubernetes tooling, portability, or a multi-service platform is required.
* Availability: multi-AZ, health-based traffic routing
* Data: replace in-memory store with managed DB + indexing.
* Deployment: rolling / blue-green with versioned images
* Performance & protection: Add caching for hot reads (e.g., Redis) and backpressure via rate limiting.
* Traffic shaping: rate limiting + queue for async workloads

The current architecture is not horizontally scalable by design.

## Observability (Discussion)

* Instrument the service with OpenTelemetry (traces, metrics, logs) and export to a backend (e.g., ELK for logs + Prometheus/Grafana for metrics).
* Define KPIs and SLOs:

    * p95 latency
    * Error rate (4xx/5xx)
    * Health check failures
    * Container restarts
    * Deployment success/failure

* Add dashboards for saturation (CPU/memory), error hotspots, and deployment health.
* Alert on SLO violations and failed health checks.
* Structured logs with correlation/request IDs and trace context propagation across service boundaries.

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