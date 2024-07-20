<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
        <v-list-item class="my-2" title="Import Tool" subtitle="hello world" prepend-icon="mdi-home"></v-list-item>
      <v-divider></v-divider>
      <v-list-item to="/projects" title="Projects" />
      <v-list-item :to="`/fundings`" link title="Fundings" />
      <v-list-item :to="`/info`" link title="Info"></v-list-item>
      <v-list-item :to="`/pure`" link title="Pure"></v-list-item>
    </v-navigation-drawer>

    <v-app-bar>
      <template v-slot:prepend>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

        <v-app-bar-title>
          <v-breadcrumbs :items="breadcrumbs" >
            <template v-slot:divider>
              <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
          </v-breadcrumbs>
        </v-app-bar-title>

        <template v-slot:extension>
          <v-tabs>
            <v-tab
              :to="`/project/` + id + `/risdata`">
              RIS Data
            </v-tab>
            <v-tab
              :to="`/project/` + id">
              View
            </v-tab>
            <v-tab
              :to="`/project/` + id + `/settings`">
              Settings ({{store.numberOfSettings}}/{{store.totalNumOfSettings}})
            </v-tab>
            <v-tab
              :to="`/project/` + id + `/transform`">
              Transform
            </v-tab>
            <v-tab
              :to="`/project/` + id + `/view`">
              PURE
            </v-tab>
          </v-tabs>
        </template>

    </v-app-bar>

    <v-main>
      <slot v-if="store.risData" />
    </v-main>

    <TransformButton />
  </v-app>
</template>

<script setup>
const drawer = ref(false);

const route = useRoute()
const store = useProjectStore();

console.log('route id', route.params.id)

const data = ref(null)

if (route.params.id) {
  console.log('route id', route.params.id)

  data.value = await $fetch(`/api/fa/projects/${route.params.id}`);
  store.risData = data.value.risData;

} else {
  console.log('no route id')
}

// watch route
watch (route, (newRoute) => {
  console.log('newRoute', newRoute)
})

const breadcrumbs = computed(() => {
  return [
    {
      title: 'Projects',
      to: '/projects',
    },
    {
      title: store.risData.title[0].text,
      to: route.path,
    }
  ]
})

const id = computed(() => {
  return route.params.id
})


const canHaveButtons = [
  'project-id-view',
  // 'project-id-settings',
  // 'project-id-transform'
]

</script>

<style scoped>
</style>
