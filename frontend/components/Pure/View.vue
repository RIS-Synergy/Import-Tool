<template>
  <v-card :title="systemName">
      <Yaml :json="data" />
  </v-card>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const { details } = props.data
const { systemName } = details

// const model = defineModel();
</script>

<style></style>
