variable "aws_region" {
  type    = string
<<<<<<< HEAD
  default = "eu-north-1"
=======
  default = "eu-west-1"
>>>>>>> 50d2fe3ced6d46d8efe7d7a9f4a3bd1b60107525
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

<<<<<<< HEAD
variable "ec2_keypair_name" {
  type        = string
  description = "Existing EC2 Key Pair name in AWS (optional; not needed for SSM)"
  default     = ""
=======
variable "ssh_cidr" {
  type        = string
  description = "Your public IP in CIDR format, e.g. 1.2.3.4/32"
}

variable "ec2_keypair_name" {
  type        = string
  description = "Existing EC2 Key Pair name in AWS"
>>>>>>> 50d2fe3ced6d46d8efe7d7a9f4a3bd1b60107525
}

variable "ecr_repo_name" {
  type    = string
  default = "tm-api"
}
