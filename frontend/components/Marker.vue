<template>
  <v-chip v-if="match" color="green">ORCID</v-chip>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  markerType: {
    type: String,
    required: true,
  },
});

const { risData } = useProjectStore();

function getOrcids() {
  const orcids = [];

  for (const teamMember of risData.team) {
    if (teamMember.type !== "PRINCIPAL_INVESTIGATOR") {
      continue;
    }
    const { person } = teamMember;
    const { identifiers } = person;
    if (!identifiers) {
      continue;
    }
    for (const id of identifiers) {
      if (id.type === "ORCID") {
        orcids.push(id.value);
      }
    }
  }

  return orcids;
}

const match = computed(() => {
  return getOrcids().includes(props.data.orcid);
});
</script>
