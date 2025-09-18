<template>
  <v-container>
    <v-table density="compact">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Research Institution</th>
          <th>Permission</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td>{{ item.username }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.researchInstitution }}</td>
          <td>
            <v-chip
              v-for="(permission, index) in item.permission"
              :key="index"
              size="small"
              class="ma-1"
            >
              {{ permission }}
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
const { users } = useApiUtils();
const { listAll } = (await users).default;
const data = await listAll();
</script>
