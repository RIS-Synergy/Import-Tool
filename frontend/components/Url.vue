<template>
  {{ model }}
  <v-btn class="ml-1 mb-1" variant="outlined" size="small" color="grey" :href="model" target="_blank">
    <v-icon class=""> mdi-open-in-new </v-icon>
    url
  </v-btn>
</template>

<script setup>
const model = defineModel();
</script>

<style scoped></style>
