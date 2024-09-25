# Database

When making the changes in the database schema (`/backend/prisma/schema.prisma`):

```
docker exec -it backend yarn prisma migrate dev
```

When asked, add a short text for the migration. Observe that the migration has been created under `/backend/prisma/migrations/...`.
