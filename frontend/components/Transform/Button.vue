<template>
  <v-footer
    v-if="canHaveButtons.includes(route.name) && store.sameNum"
    class="my-3"
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
        <span v-if="store.crisUUID">Update Project</span>
        <span v-else>Create new Project</span>
      </v-btn>
    </v-row>
  </v-footer>
</template>

<script setup>
const router = useRouter();

const route = useRoute();
const { id } = route.params;

const store = useProjectStore();

const canHaveButtons = [
  // v-if="...
  "project-id-transform",
];

const { uploadToPure } = useResearchInstitution();

async function saveTransformUpload(crud) {
  // create or edit
  console.log("ris", store.risData);

  const result = await uploadToPure(
    store.risData,
    store.settings,
    store.crisUUID,
    store.template,
  );
  store.setPure(result);

  // redirect to project view
  router.push({ name: "project-id-view", params: { id: route.params.id } });
}
</script>
