# RIS Synergy Import Tool

* Link to development: [docs/development](./docs/development.md)
* Link to docker: [docs/docker](./docs/docker.md)
* Link to production: [docs/production](./docs/production.md)
* Link to database: [docs/database](./docs/database.md)
* Link to tools: [docs/tools](./docs/tools.md)

## Getting Started

### Installation:

- Install Docker and Docker Compose
- Clone this repository
- Run `docker compose up -d` in the root directory of the repository
- Open the browser: http://localhost:3032/

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
The project is the research project that is being conducted by the research institution.

**ETL**: *Extract, *Transform*, *Load* is the process of extracting data from one system,
transforming it, and loading it into another system.
