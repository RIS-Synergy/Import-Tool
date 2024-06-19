<template>
  <v-btn @click="uploadToPure(data)" >
    Upload to PURE
  </v-btn>
</template>

<script setup>
const store = useProjectStore();
const route = useRoute();
const routes = useRouter();
console.log("routes", routes);

const id = route.params.id;
const { data } = await useFetch(`/api/fa/projects/${id}`);

const uuid = computed(async () => {
  const item = `ris:FWF:project:${id}`;
  const result = await $fetch(`/api/ri/project/${item}`);
  console.log("result project", result);
  return result;
});

</script>
