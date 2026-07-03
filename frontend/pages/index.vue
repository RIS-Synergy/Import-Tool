<template>
</template>

<script setup>
  const store = useUserSettingsStore();
  if (store.token) {
    if (store.user && (!store.user.permission || store.user.permission.length === 0)) {
      navigateTo({ path: '/new-user' });
    } else {
      navigateTo({ path: '/dashboard' });
    }
  } else {
    navigateTo({ path: '/login' });
  }
</script>
