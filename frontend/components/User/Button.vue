<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn icon v-bind="activatorProps" variant="flat" @click="dialog = true">
        <v-icon>mdi-account-outline</v-icon>
      </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card title="User">
        <v-card-text>
          <v-text-field label="Username" readonly v-model="username" />
        </v-card-text>
        <v-card-actions>
          <UserLogout />
          <v-spacer />
          <UserPassword />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const dialog = ref(false);

const username = computed(() => {
  const store = useUserSettingsStore();
  return store.user && store.user.username;
});
</script>
