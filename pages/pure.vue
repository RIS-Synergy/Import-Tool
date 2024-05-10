<template>
  <v-data-table :items="items.items" />
</template>

<script setup>
const { data: items } = await useFetch("/api/ri/search");
</script>
