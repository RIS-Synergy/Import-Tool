<template>
  <v-app id="inspire">
    <ClientOnly>
      <v-navigation-drawer v-model="drawer"> </v-navigation-drawer>
    </ClientOnly>

    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Projects</v-app-bar-title>

      <template v-if="false" v-slot:append>
        <v-btn :to="`/projects`"> projects </v-btn>
        <v-btn :to="`/fundings`"> fundings </v-btn>
        <v-btn :to="`/info`"> info </v-btn>
        <v-btn :to="`/pure`"> Pure </v-btn>
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
const drawer = ref(false);
</script>

<style scoped>
.v-btn {
  margin-right: 1em;
}
</style>
