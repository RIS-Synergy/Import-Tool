<template>
  <Yaml :json="store.risData" />
</template>

<script setup>
const store = useProjectStore();

definePageMeta({
  layout: "project"
});
</script>
