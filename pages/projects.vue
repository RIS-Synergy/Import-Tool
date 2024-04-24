<template>
  <v-data-table
    :items="items"
    density="comfortable"
    items-per-page="1"
  >
    <template v-slot:item.abstractPR="{ value }">
      -
    </template>
    <template v-slot:item.keyword="{ value }">
      -
    </template>
  </v-data-table>
  <v-data-iterator :items="items" :page="page">
    <template v-slot:header>
        header
    </template>

    <template v-slot:default="{ items }">
      <template v-for="(x, i) in items" :key="i">
        <ProjectView :item="x.raw" />
        <br/>
      </template>
    </template>

    <template v-slot:footer="{ pageCount, prevPage, nextPage }">
      <v-pagination
        v-model="page"
      ></v-pagination>
    </template>
  </v-data-iterator>
</template>

<script setup>
const { data: items } = await useFetch('http://localhost:3000/fwf-test/projects.json')
const page = ref(1)
</script>
