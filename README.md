# RIS Synergy Import Tool

## Getting Started

- Install Docker and Docker Compose
- Clone this repository with git: `git clone https://github.com/RIS-Synergy/Import-Tool`
- Go to directory: `cd Import-Tool`,
- Fetch the latest code: `git pull`
- The first time: `cp sample.env .env`, define your configuration environments.
- Run `docker compose up -d`
- Follow the logs: `docker compose logs -f`
- Create user credentials: `docker exec -it backend yarn db-user`
- Open the browser: http://localhost:3032/

## Documentation

* Link to functions: [docs/functions](./docs/functions.md)
* Link to development: [docs/development](./docs/development.md)
* Link to docker: [docs/docker](./docs/docker.md)
* Link to production: [docs/production](./docs/production.md)
* Link to database: [docs/database](./docs/database.md)
* Link to tools: [docs/tools](./docs/tools.md)
* Link to definitions: [docs/definitions](./docs/definitions.md)
