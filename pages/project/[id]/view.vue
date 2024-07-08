<template>
  <div v-if="store.pure && store.pure.pureId">
    <h1>
      view page
    </h1>
    <a v-if="store.pure && store.pure.pureId" class="" :href="blankLink" target="_blank">PURE url</a>
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

const blankLink = computed(() => {
  const pureId = store.pure.pureId;
  const link = `https://cris-test.univie.ac.at/admin/editor/dk/atira/pure/modules/unifiedprojectmodel/external/model/project/editor/upmprojecteditor.xhtml?scheme=&type=&id=${pureId}`
  console.log(link)
  return link
});


onMounted(() => {
  console.log('errors can crash here when opening the monitor after a break')
  console.log("onMounted with store", store)
  if (store && store.pure && !store.pure.pureId) {
    loadProject(id, store);
  }
});
</script>
