<template>
  <v-btn variant="flat" color="grey" rounded :href="blankLink" target="_blank">
    <v-icon class="mr-2"> mdi-open-in-new </v-icon>
    CRIS url
  </v-btn>
</template>

<script setup>
const props = defineProps({
  pureId: {
    type: String,
    required: true,
  },
  entityType: {
    type: String,
    default: "project",
  },
});

const mapEditor = {
  project: 'upmproject'
}

const blankLink = computed(() => {
  const entity = props.entityType;
  const model = 'unifiedprojectmodel'
  const editor = mapEditor[props.entityType] || entity
  const id = props.pureId;
  // TODO save link to env.
  // and to nuxt.config.ts
  const link = `https://cris-test.univie.ac.at/admin/editor/dk/atira/pure/modules/
${model}/external/model/${entity}/editor/${editor}editor.xhtml
?scheme=&type=&id=${id}`;
  return link;
});

</script>


<style scoped>
</style>
