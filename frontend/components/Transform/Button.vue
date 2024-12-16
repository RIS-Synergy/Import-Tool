<template>
  <!-- <v-footer v-if="store.sameNum" class="my-3" app> -->
    <v-row justify="center" no-gutters>
      <v-spacer></v-spacer>
      <v-btn
        class="text-none"
        variant="flat"
        rounded
        color="primary"
        @click="saveTransformUpload"
      >
        <span v-if="uuid">Update {{ entityTitle }}</span>
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
  uuid: {
    type: String,
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
    // XXX store.crisUUID, // changed this to uuid
    props.uuid,
    store.template,
    props.entityType
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
