<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-list-item v-bind="activatorProps" link @click="dialog = true">
        <b>
          {{ username }}
        </b>
        <template v-slot:append>
          <v-chip
            v-if="user && user.permission.includes('admin')"
            size="small"
            class="mr-1"
          >
            admin
          </v-chip>

          <v-icon>mdi-account</v-icon>
        </template>
      </v-list-item>
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
const { token, user } = useUserSettingsStore();

const dialog = ref(false);

const username = computed(() => {
  const store = useUserSettingsStore();
  return store.user && store.user.username;
});
</script>

<style scoped></style>
