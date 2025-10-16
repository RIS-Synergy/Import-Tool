<template>
  <AppBar title="Funding Agencies" />

  <v-table density="compact">
    <thead>
      <tr>
        <th>ID</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.id">
        <td>{{ item.id }}</td>
        <td>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
const { fa } = useApiUtils();
const { listAll } = (await fa).default;
const data = await listAll();
</script>
