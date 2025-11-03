<template>
  <v-chip class="float-right" v-if="false && isHundertPercent(model)"
    >Fractions validated</v-chip
  >
  <v-list v-if="true">
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

const data = ref({});
onMounted(async () => {
  data.value = await Promise.all(
    model.value.map(async (subj) => {
      const subject = { ...subj };
      subject.subtitle = getPercent(subject.fraction);
      const response = await getOefosID(subject.value);
      subject.title = `${subject.value}, ${response.de.Titel} / ${response.en.Titel} `;
      return subject;
    }),
  );
});
</script>

<style scoped></style>
