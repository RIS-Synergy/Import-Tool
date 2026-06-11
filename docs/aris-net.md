# ARI&Snet Cluster

## Initialize Kubernetes Secrets

### Environment Variable `JWT_SECRET`

Generate secret key:

```
pass generate aris/import-tool/staging/backend-jwt-secret -n 64
```

Create secret key in K8s:

```
oc create secret generic backend-jwt-secret --from-literal=JWT_SECRET=(pass aris/import-tool/staging/backend-jwt-secret)
```

## Initialize the database

Currently after migration, we need to create:

  - list of Research Institutions
  - create a one admin user

### Create Research Institutions

```
oc exec -it deployment/backend -c backend -n aris-importtool-staging -- \
  yarn create-ri --domains-file
```

### Create Administration User

We would need to have at least one.

```bash
oc exec -it deployment/backend -c backend -n aris-importtool-staging -- \
  yarn db-user --isAdmin
```

If we need others, we can also that. But that is optional.

### Create a regular User

```bash
oc exec -it deployment/backend -c backend -n aris-importtool-staging -- \
  yarn db-user --domain=univie.ac.at
```

## Logging

### Backend

Logging in the CLI instead of the OpenShift UI.

```bash
oc logs -l app.kubernetes.io/name=backend -f -n aris-importtool-staging
```

## Database debugging

Database SQL REPL:

```bash
oc exec -it pod/importtool-staging-db-1 -n aris-importtool-staging -- \
  psql -U postgres -d importtool
```

and then run your query, e.g.:

```sql
SELECT * FROM "User";
```
