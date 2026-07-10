<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-list-item v-bind="activatorProps" link @click="dialog = true">
        <v-list-item-title class="font-weight-bold">
          {{ username }}
        </v-list-item-title>
        <template v-slot:append>
          <v-chip
            v-if="highestPermission"
            size="small"
            class="mr-1"
          >
            {{ highestPermission }}
          </v-chip>

          <v-icon>mdi-account</v-icon>
        </template>
      </v-list-item>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card title="User">
        <v-card-text>
          <v-list class="mb-2">
            <v-list-item
              title="Research Institution"
              :subtitle="store.user?.riName || '-'"
            ></v-list-item>
            <v-list-item
              title="Email"
              :subtitle="store.user?.email || '-'"
            ></v-list-item>
            <v-list-item
              title="Username"
              :subtitle="store.user?.username || '-'"
            ></v-list-item>
            <v-list-item
              title="Given Name"
              :subtitle="store.user?.givenName || '-'"
            ></v-list-item>
            <v-list-item
              title="Family Name"
              :subtitle="store.user?.familyName || '-'"
            ></v-list-item>
          </v-list>

          <v-switch
            class="mt-n2"
            v-model="isDark"
            label="Dark Mode"
            @update:model-value="toggleTheme"
            hide-details
            color="primary"
          ></v-switch>
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
import { useTheme } from "vuetify";

const theme = useTheme();
const store = useUserSettingsStore();

const dialog = ref(false);
const isDark = ref(store.dark);

// Initialize theme state from store
onMounted(() => {
  theme.global.name.value = store.dark ? "dark" : "light";
});

function toggleTheme() {
  theme.global.name.value = isDark.value ? "dark" : "light";
  store.dark = isDark.value;
}

const username = computed(() => {
  return store.user && (store.user.displayName || store.user.username);
});

const highestPermission = computed(() => {
  if (!store.user || !store.user.permission) return null;
  if (store.user.permission.includes('superuser')) return 'superuser';
  if (store.user.permission.includes('admin')) return 'admin';
  return null;
});
</script>

<style scoped></style>
