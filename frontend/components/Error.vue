<template>
  <div>
    <v-alert
      v-if="store.error"
      :title="store.error.title"
      class="mx-3"
      border="start"
      border-color="error"
      clearable
      @click:clear="store.resetError"
    >
      {{ store.error.detail }}
    </v-alert>
  </div>
</template>

<script setup>
const store = useProjectStore();

const area = store.error && store.error.area;

</script>

<style scoped>
div {
  margin-bottom: 2.2em;
}
</style>
