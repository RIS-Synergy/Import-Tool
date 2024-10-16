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
        {{ titleName }}
      </v-app-bar-title>

      <template v-slot:append>
        <ClientOnly>
          <FilterButton v-if="needsFiltering" />
        </ClientOnly>
      </template>
    </v-app-bar>

    <v-main>
      <ClientOnly>
        <slot />
      </ClientOnly>
    </v-main>
  </v-app>
</template>

<script setup>
const drawer = ref(true);

const route = useRoute();
const store = useProjectStore();
const { setProjectId } = useApiUtils();

setProjectId(store, route);

const router = useRouter();

const titleName = computed(() => {
  const name = router.currentRoute.value.name;

  // capital first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
});

const needsFiltering = computed(() => {
  return router.currentRoute && router.currentRoute.value.name === "projects";
});
</script>

<style scoped></style>
