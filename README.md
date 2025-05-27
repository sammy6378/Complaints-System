<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

### install nest globally

```bash
 npm i -g @nestjs/cli
nest new project-name
```

---

### Creating Resources (Modules, Services, Controllers)

You can use the Nest CLI to quickly scaffold new resources. Add `--no-spec` to skip generating test (`.spec.ts`) files:

```bash
# Create a module
$ nest g module <name>
# Shortcut: nest g mo <name>
# Without test file:
$ nest g mo <name> --no-spec

# Create a service
$ nest g service <name>
# Shortcut: nest g s <name>
# Without test file:
$ nest g s <name> --no-spec

# Create a controller
$ nest g controller <name>
# Shortcut: nest g co <name>
# Without test file:
$ nest g co <name> --no-spec

# Create a full resource (module + service + controller)
$ nest g resource <name>
# Shortcut: nest g res <name>
# Without test files:
$ nest g res <name> --no-spec
```

Example:

```bash
# Generate a Cats module, controller, and service (no spec files)
$ nest g res cats --no-spec
```

For an interactive generator:

```bash
nest g resource
```

---

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
pnpm install -g @nestjs/mau
mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.
