<template>
  <v-list-item density="compact">
    CRIS API: <b>{{ cris.name }}</b>
  </v-list-item>
</template>

<script setup>
const { cris } = useUserSettingsStore();
</script>

<style scoped></style>
