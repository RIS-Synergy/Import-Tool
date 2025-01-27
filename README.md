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
- Create the [templates](./docs/templates.md) and [custom functions](./docs/functions.md) as needed.

## Documentation

* [Development](./docs/development.md)
* [Docker](./docs/docker.md)
* [Production](./docs/production.md)
* [Database](./docs/database.md)
* [Tools](./docs/tools.md)
* [Functions](./docs/functions.md)
* [Templates](./docs/templates.md)
* [Definitions](./docs/definitions.md)
