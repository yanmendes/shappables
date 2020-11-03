# shappables

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Requirements

- This project's infrastructure is maintained with Terraform. To install it, [follow the guide for your OS](https://learn.hashicorp.com/tutorials/terraform/install-cli#install-terraform).
- Docker
- Docker-compose


## Creating the stack

```sh
  chmod +x start.sh && ./start.sh
```

## Deleting the stack

```sh
  terraform destroy
```

## Developing

```sh
  npm run dev
```

### :warning: You need to have a running instance of elasticsearch (docker-compose up elasticsearch)

```sh
  npm run test:watch
```

## Testing

```sh
  npm run test:cover
```
