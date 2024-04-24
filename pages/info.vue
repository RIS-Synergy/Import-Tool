<template>
  <v-data-table :items="[items]">
    <template v-slot:item="{ item }">
      <pre>
        {{ item }}
      </pre>
    </template>
  </v-data-table>
</template>

<script setup>
const { data: items } = await useFetch("http://localhost:3000/fwf-test/info.json");
</script>
