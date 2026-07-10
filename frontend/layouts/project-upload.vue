<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <NavMenu />
    </v-navigation-drawer>

    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>
        <v-breadcrumbs :items="breadcrumbs">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </v-app-bar-title>

    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <!-- <TransformButton :entityType="Project" /> -->
  </v-app>
</template>

<script setup>
// useCron()

const drawer = ref(false);

const breadcrumbs = computed(() => {
  var result = [
    {
      title: "Project",
      to: "/projects",
    },
    {
      title: "Upload",
      to: "/project/upload",
    },
  ];
  return result;
});
</script>

<style scoped></style>
