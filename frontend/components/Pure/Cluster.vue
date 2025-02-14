<template>
  <v-dialog v-if="cluster" max-width="800">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        class="mr-2"
        v-bind="activatorProps"
        color="grey"
        rounded
        target="_blank"
      >
        {{ text }}
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <!-- <v-card :title="data.systemName"> -->
      <v-card>
        <Yaml :json="data" />
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const { clusterType, entityTypes } = defineProps({
  clusterType : {
    type: String,
    required: true,
  },
  entityTypes : {
    type: String,
    required: true,
  },
});

const store = useProjectStore();
const cluster = computed(() => store.crisData[clusterType] || null);
const text = computed(() => {
  const typ = clusterType.split("Clusters")[0];
  return typ
});

const clusterUUID = computed(() => {
  // as long as we only have one cluster
  if (!cluster.value) return null;

  return cluster.value[0].uuid
});

const { searchRIApi } = useApiUtils();
// const data = await searchRIApi(`ApplicationCluster ${clusterUUID.value}`);

const searchString = store.crisData.title.en_GB;

const data = ref(null);
if (clusterUUID.value) {
  searchRIApi(entityTypes, searchString, clusterUUID.value).then((res) => {
    data.value = res;
  });
}
</script>
