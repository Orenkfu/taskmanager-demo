Infrastructure & Deployment
High-level architecture

API: NestJS app packaged as a Docker image.

Container registry: Amazon ECR stores the built image (:latest tag used for simplicity).

Compute: Single EC2 (Ubuntu 22.04) instance runs the container and exposes HTTP on port 80.

Provisioning: Terraform provisions EC2, ECR, IAM role/profile, and the Security Group.

Deployment: GitHub Actions builds/tests, pushes image to ECR, then triggers deployment via AWS Systems Manager (SSM) (no SSH).

Why SSM instead of SSH

No inbound admin port (22) required.

No SSH key material stored as GitHub secrets.

Instance is managed through AWS IAM + SSM Agent over outbound HTTPS (443).

Command output (stdout/stderr) is retrievable and can be logged from CI.

Network security

Inbound

80/tcp open to 0.0.0.0/0 for HTTP traffic to the API.

No inbound SSH (deployment and management are via SSM).

Outbound

Open egress is required for:

SSM agent connectivity to AWS endpoints

Pulling container images from ECR

Bootstrapping packages during instance initialization

IAM / permissions model

CI (GitHub Actions) uses AWS credentials to:

authenticate to ECR and push images

invoke SSM Run Command for deployment

EC2 Instance Role grants:

AmazonEC2ContainerRegistryReadOnly – pull images from ECR

AmazonSSMManagedInstanceCore – allow SSM management (Run Command)

Instance bootstrapping (user_data)

On first boot, the instance uses user_data to install:

AWS CLI (for ECR login during deployment)

Docker Engine (to run the container)

SSM Agent (so the instance is manageable without SSH)

Deployment flow (CD)

On push to the deployment branch (or main once finalized):

Run unit tests (Jest) with coverage.

Build Docker image and push to ECR.

Deploy via SSM:

login to ECR from the instance

pull latest image

stop/remove prior container

run new container with -p 80:3000

run a local health check with retries (/health)

Terraform notes / tradeoffs

Uses the default VPC/subnet for simplicity.

AMI selection uses the latest Ubuntu 22.04 (most_recent = true) as a take-home shortcut; in production the AMI would typically be pinned or produced via an image pipeline for reproducibility.

Single-instance deployment (no load balancer, autoscaling, or multi-AZ).