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

const  { submitLogin } = useApiUtils();

const store = useUserSettingsStore();

async function login() {
  const result = await submitLogin(username.value, password.value);
  // console.log(result);
  store.setToken(result.token);
  store.setUser(result.user);

  // redirect
  router.push({ name: "projects" });
}
</script>
