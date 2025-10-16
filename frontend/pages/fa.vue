<template>
  <AppBar title="Funding Agencies" />

  <v-table density="compact">
    <thead>
      <tr>
        <th>ID</th>
        <th>Acronym</th>
        <th>Name</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.id">
        <td>{{ item.id }}</td>
        <td>
          {{ item.data.acronym }}
        </td>
        <td>
          {{ item.data.name }}
        </td>
        <td>
          <v-btn variant="outlined" size="small" @click="startSync(item.id)">
            Sync
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
const { fa } = useApiUtils();
const { listAll, startSync } = (await fa).default;
const data = await listAll();
</script>
