<template>
  <v-container fill-height fluid>
    <v-row
      style="height: 100vh"
      align="center" justify="center">
      <v-col>
        <v-sheet class="mx-auto" width="640">
          <div class="text-h3 mb-2">
            RIS Synergy
          </div>
          <div class="text-h4 mb-4">
            Import Tool
          </div>
          <LoginForm />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "custom",
});

const store = useUserSettingsStore();

const { loggedIn, user, login, logout } = useOidcAuth()
console.log("🚀 OIDC Auth State: loggedIn:", loggedIn.value, "user:", user.value)
console.log("🚀 store.user", store.user, store.token)

if (store.token) {
  if (store.user && (!store.user.permission || store.user.permission.length === 0)) {
    navigateTo({ path: '/new-user' });
  } else {
    navigateTo({ path: '/dashboard' });
  }
}
</script>
