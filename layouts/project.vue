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
        <v-breadcrumbs :items="breadcrumbs">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </v-app-bar-title>

      <template v-slot:extension>
        <ClientOnly>
          <v-tabs>
            <v-tab :to="`/project/` + id + `/risdata`"> RIS Data </v-tab>
            <v-tab :to="`/project/` + id"> View </v-tab>
            <v-tab :to="`/project/` + id + `/settings`">
              Settings ({{ store.numberOfSettings }}/{{
                store.totalNumOfSettings
              }})
            </v-tab>
            <v-tab :to="`/project/` + id + `/transform`"> Transform </v-tab>
            <v-tab
              :disabled="!store.crisId"
              :to="`/project/` + id + `/view`"> CRIS </v-tab>
          </v-tabs>
        </ClientOnly>
      </template>
    </v-app-bar>

    <v-main>
      <ClientOnly>
        <slot v-if="store.risData" />
      </ClientOnly>
    </v-main>

    <TransformButton />
  </v-app>
</template>

<script setup>
const drawer = ref(false);

const router = useRouter()
const route = useRoute();
const store = useProjectStore();

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
</script>

<style scoped></style>
