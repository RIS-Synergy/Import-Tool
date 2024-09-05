# RIS Synergy Import Tool

## Getting Started

## Setup

Before you run it the first time, initialize a password for the database, and store this under `/secrets`.

```
openssl rand -base64 32 > secrets/db_password.txt
```

## Development

Run this command in development mode:

```
docker compose -f ./compose/core.yml -f ./compose/development.yml up
```

Open the browser: http://localhost:3032/

Open the documentation (with Tob

```
typora README.md &
```

---

### Miscellaneous

Reset the database:

```
docker compose down --volumes
```
