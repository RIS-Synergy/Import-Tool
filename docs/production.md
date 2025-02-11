# Production

## Secrets

Be mindful of the `.env` file. Secrets are there! 🔑

## Testing

Create a `docker context`:

```
docker context create rissynergy-test-univie --docker "host=ssh://<username>@<your_hostname>"
```

Build the images:

```
docker --context rissynergy-test-univie compose
```

Run in production:

```
docker --context rissynergy-test-univie compose \
  -f compose.yaml -f compose.production.yaml \
  up
```

Migrate the Database:

```
docker --context rissynergy-test-univie compose \
  -f compose.yaml -f compose.production.yaml \
  exec -it backend yarn prisma migrate deploy
```

Create a user:

```
docker --context rissynergy-test-univie compose \
  -f compose.yaml -f compose.production.yaml \
  exec -it backend yarn db-user
```

Create the functions under `backend/resources/funcitons/*`:

```
docker --context rissynergy-test-univie compose \
  -f compose.yaml -f compose.production.yaml \
  exec -it backend yarn create-functions
```

## Projects (samples)

Create projects data:

```
docker --context rissynergy-test-univie compose \
  -f compose.yaml -f compose.production.yaml \
  exec -it backend yarn copy
```


## Update Release

Build:

```
docker --context rissynergy-test-univie compose \
  -f compose.yaml -f compose.production.yaml \
  build
```

Then `up`:

```
docker --context rissynergy-test-univie compose \
  -f compose.yaml -f compose.production.yaml \
  up -d --force-recreate
```

(Optional) Migrate the database (if the prisma schema has been updated):

```
docker --context rissynergy-test-univie compose \
  -f compose.yaml -f compose.production.yaml \
  exec -it backend yarn prisma migrate deploy
```

(Optional) Follow the logs:

```
docker --context rissynergy-test-univie compose \
  -f compose.yaml -f compose.production.yaml \
  logs -n 0 -f
```

(Optional) Remove old Docker data:

```
docker --context rissynergy-test-univie \
  system prune -f
```
