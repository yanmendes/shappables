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

resource "aws_s3_bucket" "image-bucket" {
  bucket = "shappables-image-bucket"
  acl    = "private"

  tags = local.tags
}
