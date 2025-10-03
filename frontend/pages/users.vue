<template>
  <AppBar title="Users" />

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
        <td>
          <b v-if="item.username === username">{{ item.username }}</b>
          <span v-else> {{ item.username }} </span>
        </td>
        <td>{{ item.email }}</td>
        <td>{{ riName(item) }}</td>
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
</template>

<script setup>
const { users } = useApiUtils();
const { listAll } = (await users).default;
const data = await listAll();

const store = useUserSettingsStore();

const username = store.user && store.user.username;

// item.researchInstitution.name
function riName(item) {
  return item.researchInstitution ? item.researchInstitution.name : "-";
}
</script>
