<template>
  <v-snackbar
    v-model="snackbar"
    multi-line
    :timeout="2000"
    color="error"
  >
    {{ error.details }}
  </v-snackbar>
</template>

<script setup>
const snackbar = ref(false);
const error = ref(null);

const nuxt = useNuxtApp();
nuxt.$listen("snackbar:error", (e) => {
  snackbar.value = true;
  error.value = e;
});
</script>
