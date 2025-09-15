<template>
  <v-btn @click="logout"> Logout </v-btn>
</template>

<script setup>
const { user } = useApiUtils()

async function logout () {
  const u = await user
  u.default.logout()
}
</script>
