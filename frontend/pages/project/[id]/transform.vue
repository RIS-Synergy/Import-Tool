<template>
  <div>
    <v-card-text v-if="true">
      <TransformSelect
        @change="loadTransformation($event)"
      />
      <TransformDiff
        v-if="result"
        :template="result.yamlTemplate"
        :result="result.transformationResult"
      />
    </v-card-text>
  </div>
</template>

<script setup>
const store = useProjectStore();
const route = useRoute();
const router = useRouter();
const { getProjectUUID, uploadToPure } = useResearchInstitution();

const id = route.params.id;
const { data: ris } = await useFetch(`/api/fa/projects/${id}`);

const transformations = ["Default", "Another Template"];
const selectedTransformation = ref("Default");

const result = ref(null);

const titles = computed(() => {
  if (!data.value) return;
  return data.value.title.map((x) => x.text);
});

const { settings, templateId } = store;

async function loadTransformation(id) {
  console.log("loadTransformation", id);

  const x = await $fetch("/api/transform/upload", {
    method: "POST",
    body: JSON.stringify({
      ris: ris.value,
      settings,
      templateId: id,
    }),
  });
  result.value = x;
}

onMounted(() => {
  loadTransformation(3); // TODO
});

const uuid = (await getProjectUUID(id)).uuid;

async function save(crud) {
  // create or edit
  console.log('ris', ris);

  const result = await uploadToPure(ris.value, settings, uuid);
  store.setPure(result);

  // redirect to project view
  router.push({ name: "project-id-view", params: { id: route.params.id } });
}

definePageMeta({
  layout: "project"
});
</script>
