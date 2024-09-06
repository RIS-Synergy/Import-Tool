# RIS Synergy Import Tool

Link to development: [docs/development](./docs/development.md)
Link to docker: [docs/docker](./docs/docker.md)

## Getting Started

### Installation:

- Install Docker and Docker Compose
- Clone this repository
- Run `docker-compose up -d` in the root directory of the repository
- Open the browser: http://localhost:3032/

## Setup

Before you run it the first time, initialize a password for the database, and store
this under `/secrets`.

```
openssl rand -base64 32 > secrets/db_password.txt
```

## Development

### Database

In development, you might want to initialize the samples from an earlier database projects' file from the FWF.

```
docker exec backend yarn db-init
```

Open the browser: http://localhost:3032/


## Production

### Secrets

Be mindful of the `/secrets` directory.

## Definitions

**RIS**:
The RIS is the Research Information System that is used by the research institution to
manage research projects.

**CRIS**:
The CRIS is the Current Research Information System that is used by the research institution
to manage research projects.

**Backend**:
The backend is the Node.js server that serves the frontend and the API.

**Frontend**:
The frontend is the React.js application that is served by the backend.

**Database**:
The database is a PostgreSQL database that is used by the backend to store data.

**Funding Agency**:
The funding agency is the organization that provides the funding for the project.

**Research Institution**:
The research institution is the organization that is conducting the research.

**Project**:
The project is the research project that is being conducted by the research institution**ETL**: *Extract, *Transform*, *Load* is the process of extracting data from one system, transforming it, and loading it into another system.

