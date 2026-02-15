terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
<<<<<<< HEAD
      version = "~> 6.0"
=======
      version = "~> 5.0"
>>>>>>> 50d2fe3ced6d46d8efe7d7a9f4a3bd1b60107525
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ami" "ubuntu" {
<<<<<<< HEAD
  most_recent = true # Shortcut - in production pin a specific ami ID
=======
  most_recent = true
>>>>>>> 50d2fe3ced6d46d8efe7d7a9f4a3bd1b60107525
  owners      = ["099720109477"] # Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_security_group" "tm_sg" {
<<<<<<< HEAD
  name_prefix = "tm-api-sg-"
  description = "Allow HTTP; manage instance via SSM"
  vpc_id      = data.aws_vpc.default.id

  ingress {
=======
  name        = "tm-api-sg"
  description = "Allow SSH and HTTP"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_cidr]
  }

  ingress {
>>>>>>> 50d2fe3ced6d46d8efe7d7a9f4a3bd1b60107525
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

<<<<<<< HEAD
  # Outbound is required for:
  # - SSM agent to reach AWS endpoints
  # - docker to pull from ECR
=======
>>>>>>> 50d2fe3ced6d46d8efe7d7a9f4a3bd1b60107525
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_iam_role" "ec2_role" {
  name = "tm-ec2-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
<<<<<<< HEAD
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
=======
      Effect = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action = "sts:AssumeRole"
>>>>>>> 50d2fe3ced6d46d8efe7d7a9f4a3bd1b60107525
    }]
  })
}

<<<<<<< HEAD
# SSM: lets AWS Systems Manager manage the instance
resource "aws_iam_role_policy_attachment" "ssm_core" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# ECR pull: lets instance pull images from ECR
=======
>>>>>>> 50d2fe3ced6d46d8efe7d7a9f4a3bd1b60107525
resource "aws_iam_role_policy_attachment" "ecr_readonly" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "tm-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

resource "aws_ecr_repository" "tm_api" {
  name = var.ecr_repo_name
<<<<<<< HEAD

  image_scanning_configuration {
    scan_on_push = true
  }
=======
>>>>>>> 50d2fe3ced6d46d8efe7d7a9f4a3bd1b60107525
}

locals {
  user_data = <<-EOF
    #!/bin/bash
    set -euxo pipefail

<<<<<<< HEAD
    apt-get update -y
    apt-get install -y ca-certificates curl gnupg awscli

    # Docker (official repo)
=======
    apt-get update
    apt-get install -y ca-certificates curl gnupg awscli

>>>>>>> 50d2fe3ced6d46d8efe7d7a9f4a3bd1b60107525
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg

<<<<<<< HEAD
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list

    apt-get update -y
=======
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
      > /etc/apt/sources.list.d/docker.list

    apt-get update
>>>>>>> 50d2fe3ced6d46d8efe7d7a9f4a3bd1b60107525
    apt-get install -y docker-ce docker-ce-cli containerd.io

    systemctl enable docker
    systemctl start docker
<<<<<<< HEAD
    usermod -aG docker ubuntu || true

    # SSM agent (Ubuntu 22.04 via snap)
    if ! command -v snap >/dev/null 2>&1; then
      apt-get install -y snapd
    fi
    snap install amazon-ssm-agent --classic
    systemctl enable snap.amazon-ssm-agent.amazon-ssm-agent.service
    systemctl restart snap.amazon-ssm-agent.amazon-ssm-agent.service
=======
>>>>>>> 50d2fe3ced6d46d8efe7d7a9f4a3bd1b60107525
  EOF
}

resource "aws_instance" "tm_ec2" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.tm_sg.id]
<<<<<<< HEAD
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  user_data              = local.user_data
  user_data_replace_on_change = true


  # Not needed for SSM, but optional for local break-glass access
  key_name = var.ec2_keypair_name != "" ? var.ec2_keypair_name : null

  tags = {
    Name = "tm-api-ec2"
    App  = "tm-api"
  }
=======
  key_name               = var.ec2_keypair_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  user_data              = local.user_data

  tags = { Name = "tm-api-ec2" }
>>>>>>> 50d2fe3ced6d46d8efe7d7a9f4a3bd1b60107525
}

output "ec2_public_ip" {
  value = aws_instance.tm_ec2.public_ip
}

output "ecr_repo_url" {
  value = aws_ecr_repository.tm_api.repository_url
}
