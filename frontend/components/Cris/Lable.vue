<template>
  <v-list-item v-if="!noCris">
    CRIS API: <b>{{ store.cris?.name }}</b>
  </v-list-item>
</template>

<script setup>
const store = useUserSettingsStore();

const noCris = computed(() => {
  return !store.cris || !store.cris.id
});
</script>

<style scoped></style>
