# Development

Run this command in development mode:

```
docker compose -f ./compose/core.yml -f ./compose/development.yml up -d
```

You might want to initialize the samples from an earlier database projects' file from the FWF.

```
docker exec backend yarn db-init
```

---

Open the browser: http://localhost:3032/

---

Run some sample projects for development:

```
docker exec backend npm run db-init
```

---

Open the documentation preview:

```
typora README.md &
```
---

If you need to inspect the container:

```
docker exec -it backend /bin/bash
```

---

Create some Projects from the FWF Funding Agency:

```
docker exec -it backend npm run copy
```
---

## VPN

Open the UniVie VPN, which is required for their test CRIS system, using a
Time-based one-time password (TOTP), a 6-digit code):

```
f5fpc -s -t vpn.univie.ac.at -d /etc/ssl/certs/ -u <username>@<code>
```

View the VPN connection:

```
f5fpc --info
```

Stop the VPN connection:

```
f5fpc --stop
```
## Logging

Run the logs (and follow the log output):

```
docker compose -f ./compose/core.yml -f ./compose/development.yml logs -f
```

## Testing

Run the tests:

```
docker exec -it backend yarn test
```

Alternatively, run the shell in the container, then run tests:

```shell
> docker exec -it backend /bin/bash
root@abcd123xyz# npm run test
```

When editing the files during development, the test process should update as you edit the tests.

### Running the test suite with an UI:

```
docker exec -it backend yarn vitest --ui --open=false --api.host=0.0.0.0
```

Then you can open http://172.20.0.3:51204/__vitest__/#/ to watch the tests as they are being edited.

The IP adress is lightly different, find the right one:

```
docker inspect backend | grep IPAddress
```

## Debugging FA API endpoints

FWF also has an unauthenticated environment with non-sensitive data:
```
curl https://risapi.dev.fwf.ac.at/info/v1/info/ | jq
```

E.g. if you want to call a Funding Agency request https://risapi.prod.fwf.ac.at/info/v1/info/ with authentication credentials, you can run this:

(test):
```
AUTH_CLIENT_ID=risapi.test.univie \
AUTH_SERVER="https://tsso.fwf.ac.at/auth/realms/sso/protocol/openid-connect/token" \
RIS_FA_API_KEY=$(pass ris/fwf-test) \
yarn --silent fa-api https://risapi.fwf.ac.at/info/v1/info/ | jq
```

(production):
```
AUTH_CLIENT_ID=risapi.prod.univie \
AUTH_SERVER="https://sso.fwf.ac.at/auth/realms/sso/protocol/openid-connect/token" \
RIS_FA_API_KEY=$(pass ris/fwf-prod) \
yarn --silent fa-api https://risapi.prod.fwf.ac.at/info/v1/info/ | jq
```

## Sync FA -> DB

Temporarily. Later we will need fewer arguments.

(test)
```
docker compose exec -it backend env RIS_FA_API_KEY=$(pass ris/fwf-test) bash -c "AUTH_CLIENT_ID='risapi.test.univie' \
  AUTH_SERVER='https://tsso.fwf.ac.at/auth/realms/sso/protocol/openid-connect/token' \
  RIS_URL_PROJECTS="https://risapi.fwf.ac.at/project/v1/projects/" \
  yarn copy"
```

(production)
```
docker compose exec -it backend env RIS_FA_API_KEY=$(pass ris/fwf-prod) bash -c "AUTH_CLIENT_ID='risapi.prod.univie' \
  AUTH_SERVER='https://sso.fwf.ac.at/auth/realms/sso/protocol/openid-connect/token' \
  RIS_URL_PROJECTS="https://risapi.prod.fwf.ac.at/project/v1/projects/" \
  yarn copy"
```
