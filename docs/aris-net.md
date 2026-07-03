# ARI&Snet Cluster

When using the Cluster, make sure we are using either `aris-importtool-staging`
or `aris-importtool-prod` namespace.

To make sure: `oc project`, _Using project "aris-importtool-staging" on server ..._

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

### Frontend Environment

#### OIDC

The same should be also done for frontend:

```
oc create secret generic frontend-oidc-session-secret \
  --from-literal=NUXT_OIDC_SESSION_SECRET=(pass aris/import-tool/staging/frontend-oidc-session-secret)

oc create secret generic frontend-oidc-token-key \
  --from-literal=NUXT_OIDC_TOKEN_KEY=(pass aris/import-tool/staging/frontend-oidc-token-key)

oc create secret generic frontend-oidc-auth-session-secret \
  --from-literal=NUXT_OIDC_AUTH_SESSION_SECRET=(pass aris/import-tool/staging/frontend-oidc-auth-session-secret)
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

### UI: create a Funding Agency API

For now it's _FWF_ and _FWF_Test_.
This can be created in the Frontend manually.

## Logging

### Backend

View all your env variables. Note, you will see secrets!

```
oc exec -it deployment/backend -c backend -n aris-importtool-staging -- env
```

Logging in the CLI instead of the OpenShift UI.

```bash
oc logs -l app.kubernetes.io/name=backend -f -n aris-importtool-staging
```

## Database debugging

Database SQL REPL:

```bash
oc exec -it pod/importtool-staging-db-1 -- \
  psql -U postgres -d importtool
```

and then run your query, e.g.:

```sql
SELECT * FROM "User";
```

or directly in the CLI:

```bash
oc exec -it service/importtool-staging-db-rw -c postgres -- \
  psql -U postgres -d importtool -c \
  'SELECT COUNT(*) FROM public."Project";'
```

### Port forwarding

```
oc port-forward service/importtool-staging-db-rw 5432:5432
```

Then you can use e.g. [DBeaver](https://dbeaver.io) or similar DB management tools in your local machine.
