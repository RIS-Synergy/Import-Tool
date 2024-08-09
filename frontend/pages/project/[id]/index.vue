<template>
  <ProjectView v-if="store && store.risData" v-model="store.risData" />
</template>

<script setup>
const route = useRoute();
const store = useProjectStore();

definePageMeta({
  layout: "project"
});
</script>
