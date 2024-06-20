<template>
  <div>
    <h1>
      view page
    </h1>
    <Yaml :json="store.pure" />
  </div>
</template>

<script setup>
const store = useProjectStore();
const route = useRoute();

const { loadProject } = useResearchInstitution();
const id = route.params.id;

definePageMeta({
  // layout: "custom"
});


onMounted(() => {
  // console.log(store)
  if (!store.pure.pureId) {
    loadProject(id, store);
  }
});
</script>
