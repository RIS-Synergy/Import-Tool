<template>
  <v-snackbar
    v-model="snackbar"
    multi-line
    :timeout="10000"
    variant="tonal"
    color="error"
  >
    <div v-if="error.status === 422">
      <!-- "message": "Referenced content with systemName: Organization and UUID: 14ac95fe-8982-4b1f-858a-4adb320c4e9c not found!",
           "errors": [],
           "method": "PUT",
           "endpoint": "/applications",
           "apiStatus": 400,
           "status": 422 -->
      <div>
        <b>Research Institution API Error</b>
      </div>
      <div>
        {{ error.method }} <i>{{ error.endpoint }}</i
        >, {{ error.apiStatus }}
      </div>
      <!-- <div>
           <i>Method</i>: {{ error.method }}
           </div>
           <div>
           <i>Status</i>: {{ error.status }}
           </div> -->
      <hr class="my-2" />
      <div>
        {{ error.message }}
      </div>
    </div>
    <pre v-else>
      {{ error }}
    </pre>

    <template v-slot:actions>
      <v-btn
        color="red"
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

const nuxt = useNuxtApp();
nuxt.$listen("snackbar:error", (e, area) => {
  snackbar.value = true;
  error.value = e.details;
});
</script>
