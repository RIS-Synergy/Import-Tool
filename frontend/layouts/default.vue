<template>
  <v-app id="inspire">
    <ClientOnly>
      <v-navigation-drawer v-model="drawer">
        <NavMenu />
      </v-navigation-drawer>
    </ClientOnly>

    <v-main>
      <v-container>
        <ClientOnly>
          <slot />
        </ClientOnly>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const drawer = ref(true);

const route = useRoute();
const title = route.meta.meta && route.meta.meta.title;

useCron();
</script>

<style scoped></style>
