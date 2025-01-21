<template>
  <StatusActive v-if="data.uuid" :data="data" />
  <span v-if="!data.uuid">
    <StatusLikely :risId="props.id" :data="likelihood" v-if="!loading && likely" />
    <v-chip v-else class="text-none" color="#ffaa60"> unknown </v-chip>
  </span>
</template>

<script setup>
const props = defineProps({
  data: Object,
  id: String,
});

const loading = ref(true);

const { diffRILikelihood } = useApiUtils();

const likelihood = ref(null);
const likely = ref(false);

if (!props.data.uuid) {
  likelihood.value = await diffRILikelihood(props.id).then((result) => {
    // result is a object with keys
    if (result.length) {
      likely.value = true;
    }
    loading.value = false;
    return result;
  });
}
</script>

<style scoped>
.label {
  font-weight: bold;
}
</style>
