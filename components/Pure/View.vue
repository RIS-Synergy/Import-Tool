<template>
  <v-card :title="systemName">
    <v-card-text>
      <pre>
        {{ data }}
      </pre>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn text="Select"></v-btn>
    </v-card-actions>
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
