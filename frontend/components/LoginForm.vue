<template>
  <v-form @submit.prevent="login">
    <v-text-field
      v-model="username"
      label="User name"
      required
      type="username"
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      required
      type="password"
    ></v-text-field>
  </v-form>
  <v-btn @click="login" type="submit" block>Login</v-btn>
</template>

<script setup>
const router = useRouter();
const username = ref("");
const password = ref("");

const { submitLogin } = useApiUtils();

const store = useUserSettingsStore();

console.log("🟢 Login form loaded");

async function login() {
  console.log("Logging in...");
  const result = await submitLogin(username.value, password.value);
  // console.log(result);
  store.setToken(result.token);
  store.setUser(result.user);

  // redirect
  console.log("Login successful", result);
  router.push({ name: "projects" });
  console.log("Redirecting to projects...");
}
</script>
