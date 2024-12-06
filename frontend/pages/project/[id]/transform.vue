<template>
  <v-container>
    <TransformEntity
      title="Project"
      templateType="project"
      :crisEntities="getCrisEntities('projects')"
    />
    <TransformEntity
      title="Application"
      templateType="application"
      :crisEntities="getCrisEntities('applications')"
    />
    <TransformEntity
      title="Award"
      templateType="award"
      :crisEntities="getCrisEntities('awards')"
    />
  </v-container>
  <TransformButton />
</template>

<script setup>
definePageMeta({
  layout: "project",
});

const { diffRILikelihood } = useApiUtils();
const route = useRoute();
const likelyhood = await diffRILikelihood(route.params.id);

function getCrisEntities(entity) {
  return likelyhood.filter((item) => item.entity === entity);
}
</script>
