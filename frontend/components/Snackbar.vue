<template>
  <v-snackbar
    v-if="error"
    v-model="snackbar"
    multi-line
    :timeout="10000"
    color="error"
  >
    <div v-if="error.status === 422">
      <div>
        <b>Research Institution API Error</b>
      </div>
      <div>
        {{ error.method }} <i>{{ error.endpoint }}</i
                                                  >, {{ error.apiStatus }}
      </div>
      <hr class="my-2" />
      <div if="error && error.apiErrorResponse && error.apiErrorResponse.message">
        {{ error.apiErrorResponse.message }}
      </div>
      <div if="error && error.message">
        {{ error.message }}
        <hr class="my-2" />
      </div>
      <pre class="small-error">{{ error.apiErrorResponse || error }}</pre>
    </div>
    <div v-else>
      <div>
        <b>Error</b>
      </div>
      <div>
        <pre class="small-error">
          {{ error }}
        </pre>
      </div>
    </div>
    <template v-slot:actions>
      <v-btn
        color="red"
        variant="text"
        icon="mdi-close"
        @click="snackbar = false"
      />
    </template>
  </v-snackbar>

  <v-snackbar
    v-if="info"
    v-model="snackbar"
    multi-line
    :timeout="10000"
    color="primary"
  >
    <div>
      <div>
        <b>Info</b>
      </div>
      <div>
        {{ info }}
      </div>
    </div>

    <template v-slot:actions>
      <v-btn
        v-if="info"
        color="blue"
        variant="text"
        icon="mdi-close"
        @click="snackbar = false"
      />
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
  info.value = null;
});

nuxt.$listen("snackbar:info", (i, area) => {
  snackbar.value = true;
  info.value = i.details;
  error.value = null;
});
</script>

<style scoped>
.small-error {
  font-size: 0.8em;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
