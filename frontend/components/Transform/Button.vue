<template>
  <!-- <v-footer v-if="store.sameNum" class="my-3" app> -->
    <v-row class="mb-3 mr-3" justify="center" no-gutters>
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
const alert = useAlertStore()
const snackbar = useSnackbar();

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
  if (!result.error) {
    // store.setError(result.error, "uploadToPure");
    // alert.setError("Error saving update", result.error);
    // return;
    //   } else {

    // might delete this
    // store.setPure(result);

    // alert.setInfo("Update saved");

    // delay 1 second:
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // refresh the page
    store.templateSelect[props.entityType] = null

    // Toggle and comment this out to desabled for convenice
    // for development (so many logs otherwise)
    // router.go(0);
  }
}

const entityTitle = computed(() => {
  return props.entityType.charAt(0).toUpperCase() + props.entityType.slice(1);
});
</script>

<style scoped>
.v-row {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
