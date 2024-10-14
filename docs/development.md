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
