<template>
  <v-row class="ma-0 align-stretch">
    <!-- Left column: Credentials inputs and Login button -->
    <v-col cols="5" class="pa-0 pr-4 d-flex flex-column">
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
    <v-col cols="6" class="pa-0 pl-4 d-flex flex-column">
      <v-btn
        @click="loginSSO"
        variant="text"
        block
        class="align-center justify-center text-wrap text-none"
        style="height: 100%"
      >
        <div class="d-flex flex-column align-center justify-center" style="width: 100%;">
          <span class="mb-2 text-center text-wrap" style="font-weight: 500; line-height: 1.2;">
            Single sign-on (SSO)
          </span>
          <img src="/arisnet-logo-orange-wide.svg" alt="Arisnet Logo" style="max-height: 64px; max-width: 100%;" />
        </div>
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
  oidcLogin("keycloak", { callbackRedirectUrl: "/auth/sso-success" });
}
</script>
