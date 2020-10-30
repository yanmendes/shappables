locals {
  env = {
      default = {}
      prod = {
        environment = "prod"
      }
      dev = {
        environment = "dev"
      }
   }
  envars    = "${contains(keys(local.env), terraform.workspace) ? terraform.workspace : "default"}"
  workspace = "${merge(local.env["default"], local.env[local.envars])}"
  tags      = {
    Environment = local.workspace["environment"]
    Project     = "shappables"
  }
}

provider "aws" {
  region  = "sa-east-1"
  version = "~> 2.67"
}

terraform {
  required_version = "0.12.28"
}

data "aws_iam_policy_document" "bucket_policy" {
  statement {
    sid = "PublicReadAccess"
    actions = ["s3:GetObject"]
    resources = ["arn:aws:s3:::shappables-image-bucket/*"]

    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}


resource "aws_s3_bucket" "image-bucket" {
  bucket = "shappables-image-bucket"
  acl    = "public-read"
  policy = data.aws_iam_policy_document.bucket_policy.json

  tags = local.tags
}

data "aws_vpc" "default-vpc" {
  default = true
}

data "http" "myip" {
  url = "http://ipv4.icanhazip.com"
}

resource "aws_security_group" "db" {
  name                  = "shappables-db-${local.workspace["environment"]}"
  vpc_id                = data.aws_vpc.default-vpc.id

  ingress {
    description         = "MySQL from current host"
    from_port           = 3306
    to_port             = 3306
    protocol            = "TCP"
    cidr_blocks         = ["${chomp(data.http.myip.body)}/32"]
  }

  egress {
    from_port           = 0
    to_port             = 0
    protocol            = "-1"
    cidr_blocks         = ["0.0.0.0/0"]
  }

  tags                  = local.tags
}

resource "random_password" "username" {
  length = 16
  special = true
  override_special = "_%@"
}

resource "random_password" "password" {
  length = 16
  special = true
  override_special = "_%@"
}

resource "aws_db_instance" "db" {
  allocated_storage       = 20
  storage_type            = "gp2"
  engine                  = "mysql"
  engine_version          = "5.7"
  instance_class          = "db.t2.micro"
  name                    = "shappables"
  parameter_group_name    = "default.mysql5.7"
  username                = random_password.username.result
  password                = random_password.password.result

  vpc_security_group_ids  = [aws_security_group.db.id]
  publicly_accessible     = true

  skip_final_snapshot     = true
  tags                    = local.tags
}
