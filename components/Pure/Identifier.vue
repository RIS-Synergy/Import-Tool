<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const item = props.item;

const text = item.type.term.en_GB

// "typeDiscriminator": "ClassifiedId",
//       "pureId": 318961207,
//       "id": "10.55776/P14608",
//       "type": {
//         "uri": "/dk/atira/pure/upm/classifiedsource/crossref_grant_id",
//         "term": {
//           "en_GB": "Crossref grant ID",
//           "de_DE": "Crossref grant ID"
//         }
//       }
</script>

<template>
  <div class="text">
    {{text}}:
  </div>
  {{ item.id }}
</template>

<style>
/* copy in a scss style global file */
.text {
  color: #999;
}
</style>
