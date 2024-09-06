# Production

## Setup

Before you run it the first time, initialize a password for the database, and store
this under `/secrets`.

```
openssl rand -base64 32 > secrets/db_password.txt
```
## Secrets

Be mindful of the `/secrets` directory.
