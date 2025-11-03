<template>
  <v-list-item v-if="!noCris">
    CRIS API: <b>{{ cris.name }}</b>
  </v-list-item>
</template>

<script setup>
const { cris } = useUserSettingsStore();

const { cris: crisId } = useUserSettingsStore();
const noCris = computed(() => {
  return !crisId || !crisId.id
});
</script>

<style scoped></style>
