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
// useCron()

const drawer = ref(true);

// const router = useRouter()
const route = useRoute();

const templateType = computed(() => {
  return route.name.split('-')[1]
});

const typeTitlePlural = computed(() => {
  try {
    return templateType.value.charAt(0).toUpperCase() + templateType.value.slice(1) + 's'
  } catch (e) {
    console.log("typeTitlePlural error", e);
    return ''
  }
});

const store = useTemplateStore();

const breadcrumbs = computed(() => {
  var result = [
    {
      title: "Templates",
    },
  ];

  result.push({
    title: typeTitlePlural.value,
    to: `/template/${templateType.value}`,
  });

  if (store.templateId) {
    result.push({
      title: store.templateTitle
      // to: route.path,
    });
  }

  return result;
});
</script>
