# RIS Synergy Import Tool

## Setup

Before you run it the first time, initalte a password for the database, and store this under `/secrets`.

```
openssl rand -base64 32 > secrets/db_password.txt
```

## Development

Run this command in development mode:

```
docker compose up
```
