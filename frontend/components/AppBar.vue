<template>
  <v-app-bar v-if="title">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>
      {{ title }}
    </v-app-bar-title>
  </v-app-bar>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
  },
});

const route = useRoute();
const title = props.title || route.meta.meta && route.meta.meta.title || route.name
</script>
