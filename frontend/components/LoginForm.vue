<template>
  <v-row class="ma-0 align-stretch">
    <!-- Left column: Credentials inputs and Login button -->
    <v-col cols="7" class="pa-0 pr-4 d-flex flex-column">
      <v-form
        @submit.prevent="login"
        class="d-flex flex-column flex-grow-1 justify-space-between"
      >
        <v-text-field
          v-model="username"
          label="User name"
          required
          type="username"
          density="comfortable"
          hide-details
          class="mb-3"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          required
          type="password"
          density="comfortable"
          hide-details
          class="mb-3"
        ></v-text-field>
        <v-btn type="submit" block>Login</v-btn>
      </v-form>
    </v-col>

    <!-- Vertical Divider -->
    <v-col cols="1" class="pa-0 d-flex justify-center align-center">
      <v-divider vertical class="mx-auto" style="height: 100%"></v-divider>
    </v-col>

    <!-- Right column: Tall SSO Button -->
    <v-col cols="4" class="pa-0 pl-4 d-flex flex-column">
      <v-btn
        @click="loginSSO"
        color="primary"
        variant="tonal"
        class="flex-grow-1 d-flex flex-column align-center justify-center text-wrap"
        style="height: 50%"
      >
        <v-icon size="large" class="mb-2 mr-1">mdi-key-outline</v-icon>
        SSO
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
const router = useRouter();
const username = ref("");
const password = ref("");

const { submitLogin } = useApiUtils();
const { login: oidcLogin } = useOidcAuth();

const store = useUserSettingsStore();

console.log("🟢 Login form loaded");

async function login() {
  console.log("Logging in...");
  const result = await submitLogin(username.value, password.value);
  // console.log(result);
  store.setToken(result.token);
  store.setUser(result.user);

  // redirect
  console.log("Login successful, redirecting to projects...");
  await navigateTo({ name: "dashboard" }, { replace: true });
}

function loginSSO() {
  console.log("Redirecting to SSO via Keycloak...");
  oidcLogin("keycloak");
}
</script>
