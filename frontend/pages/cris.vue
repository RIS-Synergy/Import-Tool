<template>
  <AppBar title="CRIS Systems" />

  <v-table density="compact">
    <thead>
      <tr>
        <th>Name</th>
        <th>API</th>
        <th>Research Institution</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.apiUrl }}</td>
        <td>{{ item.researchInstitution.name }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
const { cris } = useApiUtils();
const { listAll } = (await cris).default;
const data = await listAll();

</script>
