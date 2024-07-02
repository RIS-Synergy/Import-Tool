<template>
  <v-chip class="float-right" v-if="isHundertPercent(model)">Fractions validated</v-chip>
  <v-list>
    <v-list-item
      v-for="(x, idx) in data"
      :key="idx"
      :title="x.title"
      :subtitle="x.subtitle"
    ></v-list-item>
  </v-list>
</template>

<script setup>
const model = defineModel();

const { getOefosID } = useOefos();

function getPercent(value) {
  return value * 100 + "%";
}

function isHundertPercent(value) {
  return value.reduce((acc, x) => acc + x.fraction, 0) === 1;
}

const data = computed(() => model.value.map(x => {
  x.subtitle = getPercent(x.fraction)
  getOefosID(x.value).then((response) => {
    x.title = `${x.value}, ${response.de.Titel} / ${response.en.Titel} `
  })
  return x
}))

</script>

<style scoped></style>
