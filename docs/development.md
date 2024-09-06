# Development

Link to docker: [docker](./docker.md)

---

Run this command in development mode:

```
docker compose -f ./compose/core.yml -f ./compose/development.yml up -d
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
