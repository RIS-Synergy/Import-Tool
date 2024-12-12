<template>
  <!-- <v-footer v-if="store.sameNum" class="my-3" app> -->
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
        <span v-if="store.crisUUID">Update {{ entityTitle }}</span>
        <span v-else>Create new {{entityTitle}}</span>
      </v-btn>
    </v-row>
    <!-- </v-footer> -->
</template>

<script setup>
const props = defineProps({
  entityType: {
    type: String,
    required: true,
  },
});
const router = useRouter();

const route = useRoute();
const { id } = route.params;

const store = useProjectStore();

const { uploadToPure } = useApiUtils();

async function saveTransformUpload(crud) {
  // create or edit
  store.error = null;
  const result = await uploadToPure(
    store.risData,
    store.settings,
    store.crisUUID,
    store.template,
    entityType
  );
  if (result.error) {
    store.setError(result.error, "uploadToPure");
    return;
  } else {
    store.setPure(result);
    // redirect to project view
    router.push({ name: "project-id-view", params: { id: route.params.id } });
  }
}

const entityTitle = computed(() => {
  return props.entityType.charAt(0).toUpperCase() + props.entityType.slice(1);
});
</script>
