# CRIS API

Primarily used by `Elsevier Pure` CRIS.

## Endpoints

### Projects

- `GET  /projects/:uuid`
- `PUT  /projects/:uuid`
- `POST /projects/search`

#### Clusters

- `GET /projects/${uuid}/application-clusters`
- `GET /projects/${uuid}/award-clusters`

### Applications

- `PUT  /applications/:uuid`
- `GET  /applications/:uuid`
- `POST /applications/search`

### Awards

- `PUT  /awards/:uuid`
- `GET  /awards/:uuid`
- `POST /awards/search`

---

### Persons & ExternalPersons

- `POST /persons/search`
- `POST /external-persons/search`

### Organization

- `GET /organizations/:uuid`

### Users

- `GET /users/:uuid`
