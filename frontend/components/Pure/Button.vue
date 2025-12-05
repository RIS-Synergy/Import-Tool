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

const { cris } = useUserSettingsStore();

const urlPrefix = computed(() => {
  const apiUrl = cris?.apiUrl || ''
  // take the domain, drop everything after the first slash after the protocol
  return apiUrl.replace(/^(https?:\/\/[^\/]+).*/i, '$1')
})

const blankLink = computed(() => {
  const entity = props.entityType;
  const model = 'unifiedprojectmodel'
  const editor = mapEditor[props.entityType] || entity
  const id = props.pureId;
  // TODO currently it's only working for Pure, won't work for other CRIS systems
  const link = `${urlPrefix.value}/admin/editor/dk/atira/pure/modules/
${model}/external/model/${entity}/editor/${editor}editor.xhtml
?scheme=&type=&id=${id}`;
  return link;
});

</script>


<style scoped>
</style>
