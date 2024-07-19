<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
    </v-navigation-drawer>

    <v-app-bar>
      <template v-slot:prepend>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

        <v-app-bar-title>
          <v-breadcrumbs
            :items="breadcrumbs"
          >
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
      <slot />
    </v-main>

    <TransformButton />
    <!-- <v-footer
         v-if="!canHaveButtons.includes(route.name) && store.sameNum"
         app
         >
         <v-row justify="center" no-gutters>
         <v-spacer></v-spacer>
         <v-btn
         class="text-none"
         variant="flat"
         rounded
         width="12em"
         color="primary"
         @click="save"
         >
         <span v-if="uuid">Update Project</span>
         <span v-else>Create new Project</span>
         </v-btn>

         <!-- <v-btn
         v-for="link in links"
         :key="link"
         width="12em"
         color="black"
         class="mx-2"
         rounded="xl"
         variant="flat"
         >
         {{ link }}
         </v-btn> -->
    <!-- </v-row>
         </v-footer> -->
  </v-app>
</template>

<script setup>
const drawer = ref(false);

// current url
const route = useRoute()
const id = route.params.id;

const breadcrumbs = ref(null)

const { getProjectUUID, uploadToPure } = useResearchInstitution();
const uuid = (await getProjectUUID(id)).uuid;

const store = useProjectStore();

onMounted(async () => {
  breadcrumbs.value = [
    {
      title: 'Projects',
      to: '/projects',
    }
  ]

  const data = await $fetch(`/api/fa/projects/${id}`);
  console.log(data)

  store.risData = data.risData;

  breadcrumbs.value.push({
    to: route.path,
    title: store.risData.title[0].text
  })
})

onUpdated (() => {
  console.log('updated')
  console.log('route', route)

})

const canHaveButtons = [
  'project-id-view',
  // 'project-id-settings',
  // 'project-id-transform'
]

const links = [
  'settings',
  'transform?',
  // 'About Us',
  // 'Team',
  // 'Services',
  // 'Blog',
  // 'Contact Us',
]


</script>

<style scoped>
.v-btn {
  /* margin-right: 1em; */
}
</style>
