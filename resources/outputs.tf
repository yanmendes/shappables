output "bucket" {
  value = "${aws_s3_bucket.image-bucket.bucket}"
}

output "db_user" {
  value     = "${aws_db_instance.db.username}"
  sensitive = true
}

output "db_password" {
  value     = "${aws_db_instance.db.password}"
  sensitive = true
}

output "db_endpoint" {
  value     = "${aws_db_instance.db.endpoint}"
  sensitive = true
}

output "db_name" {
  value     = "${aws_db_instance.db.name}"
  sensitive = true
}
