<template>
  <StatusLikely
    v-if="!loading && likely"
    :risId="props.id"
    :data="likelihood"
    :uuid="props.data.uuid"
  />
  <v-chip v-else class="text-none" color="orange">Unknown</v-chip>
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

//if (!props.data.uuid) {
  likelihood.value = await diffRILikelihood(props.id).then((result) => {
    // result is a object with keys
    if (result.length) {
      likely.value = true;
    }
    loading.value = false;
    return result;
  });
//}
</script>

<style scoped>
.label {
  font-weight: bold;
}
</style>
