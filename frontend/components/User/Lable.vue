<template>
  <v-list-item>
    User: <b>{{ user.username }}</b>
    <template v-slot:append>
      <v-chip
        density="compact"
        v-if="user.permission.includes('admin')" size="small" class="ma-0">
      admin
    </v-chip>
    <UserButton />
    </template>
  </v-list-item>

</template>

<script setup>
const { token, user } = useUserSettingsStore();
</script>

<style scoped></style>
