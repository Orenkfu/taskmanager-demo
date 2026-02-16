variable "aws_region" {
  type    = string
  default = "eu-north-1"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "ec2_keypair_name" {
  type        = string
  description = "Existing EC2 Key Pair name in AWS (optional; not needed for SSM)"
  default     = ""
}

variable "ecr_repo_name" {
  type    = string
  default = "tm-api"
}
