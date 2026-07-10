<template>
  <v-container class="fill-height" style="min-height: 80vh">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-card class="pa-10" elevation="2">
          <v-icon size="80" color="warning" class="mb-6">mdi-account-clock</v-icon>
          <h2 class="text-h4 font-weight-bold mb-4">Pending</h2>
          <p class="text-body-1 text-medium-emphasis">
            Contact your CRIS department from your institution<span v-if="store.user?.riName">, <b>{{ store.user.riName }}</b>,</span>
            to grant you access to the Import Tool.
          </p>
          <div class="mt-8">
            <v-btn to="/" color="primary" variant="elevated">Back to Home</v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "custom",
});

const store = useUserSettingsStore();
const ssoCookie = useCookie('sso_backend_data', { path: '/' });

onMounted(() => {
  if (ssoCookie.value) {
    try {
      const binStr = atob(String(ssoCookie.value));
      const bytes = Uint8Array.from(binStr, (m) => m.codePointAt(0));
      const decodedPayload = JSON.parse(new TextDecoder().decode(bytes));
      if (decodedPayload.backendData) {
        if (decodedPayload.backendData.token) {
          store.setToken(decodedPayload.backendData.token);
        }
        if (decodedPayload.backendData.user) {
          store.setUser(decodedPayload.backendData.user);
        }
      }
    } catch (e) {
      console.error("Failed to decode sso_backend_data cookie", e);
    } finally {
      ssoCookie.value = null; // Clear it so it doesn't process again
    }
  }

  if (!store.user) {
    return navigateTo('/');
  }
});
</script>
