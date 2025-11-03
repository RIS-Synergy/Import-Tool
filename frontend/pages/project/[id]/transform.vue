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
</template>

<script setup>
definePageMeta({
  layout: "project",
});

const { cris } = useApiUtils();
const { diffRILikelihood } = (await cris).default;

const route = useRoute();
const likelyhood = await diffRILikelihood(route.params.id);

function getCrisEntities(entity) {
  return likelyhood && likelyhood.filter((item) => item.entity === entity);
}
</script>
