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
  </v-app>
</template>

<script setup>
const drawer = ref(true);

const route = useRoute();
const name = route.params.id;

const breadcrumbs = ref([
  {title: "Functions",
    to: "/functions",
  },
]);

// seems odd to have do the same things twice here....
// otherise there are still similar errors as in the other layouts, like 'project'
// the error is that the top level backrougnd breadcrumbs are not presable

onMounted(() => {
  if (name) {
    breadcrumbs.value.push({
      title: name,
      to: `/functions/${name}`,
    });
  }
});

watch (() => route.params.id, (name) => {
  if (name) {
    breadcrumbs.value.push({
      title: name,
      to: `/functions/${name}`,
    });
  } else {
    breadcrumbs.value = [
      {title: "Functions",
        to: "/functions",
      },
    ];
  }
});
</script>

<style scoped></style>
