<template>
  diff
</template>

<script setup>
const store = useProjectStore();
const route = useRoute();

// const { loadProject } = useResearchInstitution();
const id = route.params.id;

onMounted(() => {
  console.log("diff onMounted");
});

definePageMeta({
  layout: "project",
});
</script>

<style scoped>
</style>
