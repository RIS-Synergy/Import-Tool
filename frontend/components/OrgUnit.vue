<template>
  <span v-for="name in names">
    {{name.text}}
  </span>

  <span v-for="identifier in identifiers">
    <v-btn class="ml-2 mb-1" variant="outlined" size="small" color="grey" :href="identifier.value" target="_blank">
      <v-icon class=""> mdi-open-in-new </v-icon>
      {{ identifier.type }}
    </v-btn>
  </span>
</template>

<script setup>
const model = defineModel();
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  names: {
    type: Object,
    required: true
  },
  identifiers: {
    type: Object,
    required: true
  }
});
</script>

<style scoped></style>
