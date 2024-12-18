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

      <template v-slot:extension>
          <v-tabs v-model="tabLeft">
            <v-tab :to="`/project/` + id + `/risdata`"> RIS Data </v-tab>
            <v-tab :to="`/project/` + id"> View </v-tab>
            <v-tab :to="`/project/` + id + `/settings`">
              Settings ({{ store.numberOfSettings }}/{{
                                                     store.totalNumOfSettings
                                                     }})
            </v-tab>
            <v-tab :to="`/project/` + id + `/transform`"> Transform </v-tab>
          </v-tabs>
          <v-spacer />
          <v-tabs right v-model="tabRight">
            <v-tab
              :disabled="!store.crisId"
              :to="`/project/` + id + `/view`"> CRIS </v-tab>
            <v-tab
              :to="`/project/` + id + `/diff`"> Diff </v-tab>
          </v-tabs>

      </template>
    </v-app-bar>

    <v-main>
      <slot v-if="store.risData" />
    </v-main>

    <Error />
  </v-app>
</template>

<script setup>
useCron()

const drawer = ref(true);

const router = useRouter()
const route = useRoute();
const store = useProjectStore();

const tabLeft = ref(0);
const tabRight = ref(0);

// when one of the tabs changes, reset the other one
watch(tabLeft, () => {
  if (tabLeft.value !== null) {
    tabRight.value = null;
  }
});
watch(tabRight, () => {
  if (tabRight.value !== null) {
    tabLeft.value = null;
  }
});

store.resetError()

const { setProjectId } = useApiUtils();

const id = computed(() => {
  return router.currentRoute.value.params.id // router for layouts, route in a page
});

if (id) {
  setProjectId(store, router.currentRoute.value);
} else {
  console.log("no route id");
}

const breadcrumbs = computed(() => {
  var result = [
    {
      title: "Projects",
      to: "/projects",
    },
  ];
  if (!store.risData) return result;

  var title = "";
  try {
    title = store.risData.title[0].text;
  } catch (e) {
    console.log("title error", e);
    // return result
    // title = ''
  }

  result.push({
    title,
    to: route.path,
  });

  return result;
});


const canHaveButtons = [
  "project-id-view",
];

// Apply the runtime config to the store (settings: e.g. person and orgs)
// This is only needed for RIS_DEV values
const config = useRuntimeConfig()
store.setSettings(config.public)
</script>

<style scoped></style>
