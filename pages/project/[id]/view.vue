<template>
  <div v-if="store.pure && store.pure.pureId">
    <div class="ma-3 right">
      <v-btn
        v-if="store.pure && store.pure.pureId"
        class=""
        variant="flat"
        color="grey"
        rounded
        :href="blankLink"
        target="_blank"
      >
        <v-icon class="mr-2"> mdi-open-in-new </v-icon>
        PURE url
      </v-btn>
    </div>
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
  const link = `https://cris-test.univie.ac.at/admin/editor/dk/atira/pure/modules/unifiedprojectmodel/external/model/project/editor/upmprojecteditor.xhtml?scheme=&type=&id=${pureId}`;
  console.log(link);
  return link;
});

onMounted(() => {
  console.log("errors can crash here when opening the monitor after a break");
  console.log("onMounted with store", store);
  if (store && store.pure && !store.pure.pureId) {
    loadProject(id, store);
  }
});

definePageMeta({
  layout: "project",
});
</script>

<style scoped>
.right {
  float: right;
}
</style>
