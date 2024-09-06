# Development

Run this command in development mode:

```
docker compose -f ./compose/core.yml -f ./compose/development.yml up -d
```

You might want to initialize the samples from an earlier database projects' file from the FWF.

```
docker exec backend yarn db-init
```

Open the browser: http://localhost:3032/

---

Run some sample projects for development:

```
docker exec backend npm run db-init
```

---

Open the documentation preview

```
typora README.md &
```
---

If you need to inspect the container:

```
docker exec -it backend /bin/bash
```
