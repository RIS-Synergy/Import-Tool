<template>
  <div v-if="hasCrisData">
    <div class="ma-3 right">
      <PureCluster entity-types="applications" cluster-type="applicationClusters" />
      <PureCluster entity-types="awards" cluster-type="awardClusters" />
      <v-btn
        v-if="hasCrisData"
        class=""
        variant="flat"
        color="grey"
        rounded
        :href="blankLink"
        target="_blank"
      >
        <v-icon class="mr-2"> mdi-open-in-new </v-icon>
        CRIS url
      </v-btn>
    </div>
    <Yaml :json="store.crisData" />
  </div>
</template>

<script setup>
const store = useProjectStore();
const route = useRoute();

const { loadProject } = useApiUtils();
const id = route.params.id;

const { crisId, crisUUID } = store;

const hasCrisData = computed(() => {
  return store.crisData && store.crisId
});

const blankLink = computed(() => {
  // const pureId = store.pure.pureId;
  const link = `https://cris-test.univie.ac.at/admin/editor/dk/atira/pure/modules/unifiedprojectmodel/external/model/project/editor/upmprojecteditor.xhtml?scheme=&type=&id=${crisId}`;
  return link;
});

onMounted(() => {
  // console.log("errors can crash here when opening the monitor after a break");
  // console.log("onMounted with store", store);
  if (store && store.crisId) {
    loadProject(id);
  }
});

definePageMeta({
  layout: "project",
});

onBeforeRouteUpdate((to, from, next) => {
  console.log("onBeforeRouteUpdate [view]", to, from);
  next();
});
</script>

<style scoped>
.right {
  float: right;
}
</style>
