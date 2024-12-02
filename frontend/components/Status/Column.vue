<template>
  <StatusActive
    v-if="data.uuid"
    :data="data"
  />
  <span v-else>
    <v-progress-circular v-if="loading" color="#ffaa60" size="25" indeterminate>
    </v-progress-circular>
    <StatusLikely
      :data = "likelihood"
      v-else-if="likely"
    />
    <v-chip v-else class="text-none" color="#ffaa60">
      unknown
    </v-chip>
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
    console.log("likelihood", result);
    // result is a object with keys
    if (result.length) {
      likely.value = true
    }
    loading.value = false;
    return result;
  });
}

onMounted(() => {
  console.log("mounted", props.id);
});
</script>

<style scoped>
.label {
  font-weight: bold;
}
</style>
