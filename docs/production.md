# Production

## Secrets

Be mindful of the `.env` file. Secrets are there! 🔑

## Testing

Build the images:

```
docker compose
```

Run in production:

```
docker compose \
  -f compose.yaml -f compose.production.yaml \
  up
```

Migrate the Database:

```
docker compose \
  -f compose.yaml -f compose.production.yaml \
  exec -it backend yarn prisma migrate deploy
```

Create a user:

```
docker compose \
  -f compose.yaml -f compose.production.yaml \
  exec -it backend yarn db-user
```

Create the functions under `backend/resources/funcitons/*`:

```
docker compose \
  -f compose.yaml -f compose.production.yaml \
  exec -it backend yarn create-functions
```

## Projects (samples)

Create projects data:

```
docker compose \
  -f compose.yaml -f compose.production.yaml \
  exec -it backend yarn copy
```


## Update Release

Build:

```
docker compose -f compose.yaml -f compose.production.yaml build
```

Then `up`:

```
docker compose -f compose.yaml -f compose.production.yaml \
  up -d --force-recreate
```

(Optional) Migrate the database (if the prisma schema has been updated):

```
docker compose -f compose.yaml -f compose.production.yaml \
  exec -it backend yarn prisma migrate deploy
```

(Optional) Follow the logs:

```
docker compose -f compose.yaml -f compose.production.yaml \
  logs -n 0 -f
```

(Optional) Remove old Docker data:

```
docker system prune -f
```
