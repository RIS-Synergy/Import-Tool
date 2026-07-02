<template>
  <v-container>
    <h1>OIDC Info</h1>
    <v-card class="pa-4 mt-4">
      <h3>Logged In:</h3>
      <pre>{{ loggedIn }}</pre>
      
      <h3>User:</h3>
      <pre>{{ user }}</pre>
      
      <h3>Session:</h3>
      <pre>{{ session }}</pre>
    </v-card>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "custom",
});

const { loggedIn, user, session, fetch } = useOidcAuth();

console.log('OIDC Page - Server/Client state:');
console.log('loggedIn:', loggedIn.value);
console.log('user:', user.value);

onMounted(async () => {
  console.log('Fetching session...');
  await fetch();
  console.log('Fetched loggedIn:', loggedIn.value);
});
</script>
