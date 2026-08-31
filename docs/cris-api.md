# CRIS API

Primarily used by `Elsevier Pure` CRIS.

## Endpoints

### Projects

- `GET  /projects/:uuid`
- `PUT  /projects/:uuid`
- `POST /projects/search`

#### Fields (Read and write) (Allow all fields)

### Applications

- `GET  /applications/:uuid`
- `PUT  /applications/:uuid`
- `POST /applications/search`

#### Fields (Read and write) (Allow all fields)

### ApplicationCluster

- `GET /projects/${uuid}/application-clusters`
- `PUT /projects/${uuid}/application-clusters`

#### Fields (Read and write)

- project
- uuid

### Awards

- `GET  /awards/:uuid`
- `PUT  /awards/:uuid`
- `POST /awards/search`

#### Fields (Read and write) (Allow all fields)

### AwardCluster

- `GET /projects/${uuid}/award-clusters`
- `PUT /projects/${uuid}/award-clusters`

#### Fields (Read and write)

- project
- uuid

### ClassificationScheme

#### Fields (Read-only) (Allow all fields)

---

### Persons

- `POST /persons/search`

#### Fields (Read-only)

- name
- orcid
- pureId
- staffOrganizationAssociations
- systemName
- user
- uuid

### ExternalPersons

- `POST /external-persons/search`

#### Fields (Read-only)

- email
- name
- pureId
- uuid

### Organization

- `GET /organizations/:uuid`

#### Fields (Read-only)

- name
- uuid

### Users

- `GET /users/:uuid`

#### Fields (Read-only)

- email
- username

These fields are needed on the `/project/[id]` page.
