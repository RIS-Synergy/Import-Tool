<template>
  <StatusLikely
    v-if="!loading && likely"
    :risId="props.id"
    :data="likelihood"
    :uuid="props.data.uuid"
    :same="projectEqualDiff"
  />
  <span v-else-if="noCris" />
  <v-chip v-else class="text-none" color="orange">Unknown</v-chip>
</template>

<script setup>
const props = defineProps({
  data: Object,
  id: String,
});

const loading = ref(true);

const { cris } = useApiUtils();
const { diffRILikelihood, getDiffs } = (await cris).default;

const likelihood = ref(null);
const likely = ref(false);
const projectEqualDiff = ref(false);

const store = useProjectStore();
const templateSelected = computed(() => {
  return store.getTemplateByEntity("Project");
});

const { cris: crisId } = useUserSettingsStore();
const noCris = computed(() => {
  return !crisId || !crisId.id
});

async function findProjectDiffs(uuid) {
  const result = await getDiffs(
    props.id,
    "Project",
    uuid,
    templateSelected.value,
  );
  // console.log(props.id, uuid, result.countRIS);
  if (result.countRIS === 0) {
    projectEqualDiff.value = true;
  }
}

likelihood.value = await diffRILikelihood(props.id).then((result) => {
  // result is a object with keys
  if (result.length) {
    likely.value = true;
  }
  loading.value = false;

  // if project
  result.forEach((item) => {
    if (item.systemName === "Project") {
      findProjectDiffs(item.uuid);
    }
  });
  return result;
});
</script>

<style scoped>
.label {
  font-weight: bold;
}
</style>
