<template>
  <v-chip class="float-right" v-if="isHundertPercent(model)">Fractions validated</v-chip>
  <v-list>
    <v-list-item
      v-for="(x, idx) in model"
      :key="idx"
      :title="getPercent(x.fraction)"
      :subtitle="x.value"
    ></v-list-item>
  </v-list>
</template>

<script setup>
const model = defineModel();

function getPercent(value) {
  return value * 100 + "%";
}

function isHundertPercent(value) {
  return value.reduce((acc, x) => acc + x.fraction, 0) === 1;
}
</script>

<style scoped></style>
