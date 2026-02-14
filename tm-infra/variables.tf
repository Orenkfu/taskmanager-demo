variable "aws_region" {
  type    = string
  default = "eu-west-1"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "ssh_cidr" {
  type        = string
  description = "Your public IP in CIDR format, e.g. 1.2.3.4/32"
}

variable "ec2_keypair_name" {
  type        = string
  description = "Existing EC2 Key Pair name in AWS"
}

variable "ecr_repo_name" {
  type    = string
  default = "tm-api"
}
