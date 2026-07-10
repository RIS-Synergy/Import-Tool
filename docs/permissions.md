# Permissions

There are three main permission levels in the system:

### Editor `edit`

General users.

Can use the basic features of the Import Tool (e.g., viewing and syncing data, preparing templates).

**Restrictions**:
- Cannot modify the permissions of other users or access administrative settings.

### Institution Administrator` admin`

Department or institution leads.

- Includes all `edit` capabilities.
- Can view all users belonging to their own Research Institution.
- Can grant or revoke the `edit` and `admin` permissions for users within their own Research Institution.

**Restrictions**:
- Cannot edit users from other Research Institutions.
- Cannot grant or revoke the `superuser` permission.

### System Administrator `superuser`

- Full access to all features.
- Can view all users across all Research Institutions.
- Can edit permissions of any user in the system.
- Can grant or revoke any permission, including `superuser`.

### _Pending Users_

When a new user logs into the system for the first time via SSO, they are assigned **no permissions** `[]`.

They will see a "Pending" screen and must be granted at least the `edit` permission by an `admin` of their Research Institution (or a `superuser`), before they can access the tool.
