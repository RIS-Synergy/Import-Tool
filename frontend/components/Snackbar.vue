<template>
  <v-snackbar
    v-model="snackbar"
    multi-line
    :timeout="10000"
    variant="tonal"
    :color="error ? 'error' : 'primary'"
  >
    <div v-if="error && error.status === 422">
      <div>
        <b>Research Institution API Error</b>
      </div>
      <div>
        {{ error.method }} <i>{{ error.endpoint }}</i
        >, {{ error.apiStatus }}
      </div>
      <hr class="my-2" />
      <div>
        {{ error.message }}
      </div>
    </div>

    <div v-if="info">
      <div>
        <b>Info</b>
      </div>
      <div>
        {{ info }}
      </div>
    </div>

    <template v-slot:actions>
      <v-btn
        v-if="error"
        color="red"
        variant="text"
        icon="mdi-close"
        @click="snackbar = false"
      >
      </v-btn>
      <v-btn
        v-if="info"
        color="blue"
        variant="text"
        icon="mdi-close"
        @click="snackbar = false"
      >
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
const snackbar = ref(false);
const error = ref(null);
const info = ref(null);

const nuxt = useNuxtApp();
nuxt.$listen("snackbar:error", (e, area) => {
  snackbar.value = true;
  error.value = e.details;
  info.value = null
});

// TODO ui not yet implemented
nuxt.$listen("snackbar:info", (i, area) => {
  console.warn("snackbar:info not implemented", i, area);
  snackbar.value = true;
  info.value = i.details;
  error.value = null;
});
</script>
