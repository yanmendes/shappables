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
