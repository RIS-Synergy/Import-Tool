<template>
  <!-- <v-list v-if="Array.isArray(model)"> -->
    <v-list-item
      v-for="(x, idx) in model"
      :key="idx"
      :title="x.type"
      :subtitle="x.value"
    ></v-list-item>
    <!-- </v-list> -->
    <!-- <v-list-item v-else :title="model.type" :subtitle="model.value"></v-list-item> -->
</template>

<script setup>
const model = defineModel();
</script>

<style scoped></style>
