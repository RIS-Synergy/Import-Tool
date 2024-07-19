<template>
  <v-footer
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
        @click="saveTransformUpload"
      >
        <span v-if="uuid">Update Project</span>
        <span v-else>Create new Project</span>
      </v-btn>
    </v-row>
  </v-footer>
</template>


<script setup>
const router = useRouter();

const route = useRoute()
const { id } = route.params

const store = useProjectStore();

// Exclude this page in footer button
const canHaveButtons = [
  'project-id-view',
]

const { getProjectUUID, uploadToPure } = useResearchInstitution();
const uuid = (await getProjectUUID(id)).uuid;

async function saveTransformUpload(crud) {
  // create or edit
  console.log('ris', store.risData);

  const result = await uploadToPure(store.risData, store.settings, uuid);
  store.setPure(result);

  // redirect to project view
  router.push({ name: "project-id-view", params: { id: route.params.id } });
}
</script>
