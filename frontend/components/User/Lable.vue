<template>
  <div v-if="data" class="ml-4">
    {{ data.user.username }}
  </div>
</template>

<script setup>
const { token } = useUserSettingsStore();

const user = ref(null)

const { data } = await useFetch("/user", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ token: token }),
});
</script>

<style scoped>
</style>

