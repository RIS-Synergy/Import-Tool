<template>
  <v-app id="inspire">
    <ClientOnly>
      <v-navigation-drawer v-model="drawer">
        <NavMenu />
      </v-navigation-drawer>
    </ClientOnly>

    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>
        <span v-if="false">Import Tool</span>
      </v-app-bar-title>

    </v-app-bar>

    <v-main>
      <ClientOnly>
        <slot />
      </ClientOnly>
    </v-main>
  </v-app>
</template>

<script setup>
const drawer = ref(false);

const route = useRoute();
const store = useProjectStore();
const { setProjectId } = useApiUtils();

setProjectId(store, route);
</script>

<style scoped>
.v-btn {
  margin-right: 1em;
}
</style>
