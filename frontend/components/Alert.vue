<template>
  <div v-if="store.error || store.info">
    <v-alert
      :title="store.title"
      class="mx-3"
      border="start"
      :border-color="store.color"
      closable
      @click:close="store.reset"
    >
<pre>
{{ store.details }}
</pre>
    </v-alert>
  </div>
</template>

<script setup>
const store = useAlertStore();
</script>

<style scoped>
div {
  margin-bottom: 0.4em;
}
</style>
