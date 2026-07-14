<template>
  <AppBar title="Research Institutions" />

  <v-table density="compact">
    <thead>
      <tr>
        <th>Name</th>
        <th>Domain</th>
        <th>Projects</th>
        <th>ROR</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.id">
        <td v-if="item.id === userRI"><b>{{ item.name }}</b></td>
        <td v-else>{{ item.name }}</td>
        <td>{{ item.domain }}</td>
        <td>{{ item._count?.projects || 0 }}</td>
        <td>
          <v-btn
            class=""
            variant="outlined"
            size="small"
            color="grey"
            :href="rorUrl(item.rorId)"
            target="_blank"
          >
            <v-icon class=""> mdi-open-in-new </v-icon>
            ROR
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
const store = useUserSettingsStore();
if (!store.user?.permission?.includes('superuser')) {
  navigateTo('/');
}

const { ri } = useApiUtils();
const { listAll } = (await ri).default;
const data = await listAll();

const userRI = store.user && store.user.ri;

function rorUrl(id) {
  return `https://ror.org/${id}`;
}
</script>
