<template>
  <v-row class="mb-3 mr-3" justify="center" no-gutters>
    <!-- <v-spacer></v-spacer> -->
    <v-btn
      class="text-none"
      variant="flat"
      rounded
      color="primary"
      @click="saveTransformUpload"
    >
      <span v-if="uuid">Update {{ entityTitle }}</span>
      <span v-else>Create new {{ entityTitle }}</span>
    </v-btn>
  </v-row>
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
const alert = useAlertStore();
const snackbar = useSnackbar();

const { uploadToPure } = useApiUtils();

async function saveTransformUpload(crud) {
  // create or edit
  store.error = null;
  const result = await uploadToPure(
    store.risData,
    store.settings,
    props.uuid,
    store.template,
    props.entityType,
  );
  if (!result.error) {
    // turn off the left 'O' "Select" button
    store.templateSelect[props.entityType] = null;
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
