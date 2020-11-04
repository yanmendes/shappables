# shappables

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![codecov](https://codecov.io/gh/yanmendes/shappables/branch/master/graph/badge.svg)](https://codecov.io/gh/yanmendes/shappables)

## Requirements

- This project's infrastructure is maintained with Terraform. To install it, [follow the guide for your OS](https://learn.hashicorp.com/tutorials/terraform/install-cli#install-terraform).
- Docker
- Docker-compose

## Creating the stack

```sh
  chmod +x start.sh && ./start.sh
```

This script:
- Creates the S3 bucket
- Creates the RDS instance
- Creates a security group that restricts access to the DB to your machine's IP
- Creates a elasticsearch cluster **[TODO]**
- Spawns a elasticsearch instance via docker-compose
- Builds and starts a production instance of both the `client` and `server`

## Deleting the stack

```sh
  terraform destroy
```

## Running tests

```sh
  npm run bootstrap
  npm run test:cover
```

## Developing

```sh
  npm run dev
```
