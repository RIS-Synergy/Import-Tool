<template>
  <v-chip class="float-right" v-if="false && isHundertPercent(model)"
    >Fractions validated</v-chip
  >
  <div v-if="true" class="mt-2">
    <OefosHierarchy
      v-for="(x, idx) in data"
      :key="idx"
      :code="x.value"
      :title="x.localizedTitle"
      :subtitle="x.subtitle"
    />
  </div>
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
      subject.localizedTitle = `${response.de.Titel} / ${response.en.Titel}`;
      subject.title = `${subject.value}, ${subject.localizedTitle}`;
      return subject;
    }),
  );
});
</script>

<style scoped></style>
