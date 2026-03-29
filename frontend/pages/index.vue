<template>
</template>

<script setup>
  const store = useUserSettingsStore();
  if (store.token) {
    navigateTo({ path: '/dashboard' });
  } else {
    navigateTo({ path: '/login' });
  }
</script>
