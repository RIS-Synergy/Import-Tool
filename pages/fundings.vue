<template>
  <v-data-table :items="items" >
  </v-data-table>
</template>

<script setup>
const { data: items } = await useFetch('http://localhost:3000/fwf-test/fundings.json')
</script>
