<template>
  <v-container>
    <TransformEntity title="Project" templateType="project" />
    <TransformEntity title="Application" templateType="application" />
    <TransformEntity title="Award" templateType="award" />
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "project",
});
</script>
