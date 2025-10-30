<template>
  <v-row v-if="!uuid" class="ma-3" justify="end" no-gutters>
    <!-- <v-spacer></v-spacer> -->
    <v-btn
      class="text-none"
      variant="flat"
      rounded
      color="primary"
      @click="saveTransformUpload" >
      <span>Create new {{ entityTitle }}</span>
    </v-btn>
  </v-row>
  <v-row v-else class="lower-right mb-3 mr-3" justify="end" no-gutters>
    <v-btn
      class="text-none"
      variant="flat"
      rounded
      color="primary"
      @click="saveTransformUpload" >
      <span>Update {{ entityTitle }}</span>
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

const { cris } = useApiUtils();
const { uploadApi } = (await cris).default;

async function saveTransformUpload(crud) {
  // create or edit
  store.error = null;
  const result = await uploadApi(
    {
      ris: store.risData,
      settings: store.settings,
      uuid: props.uuid,
      templateId: store.template[`${props.entityType}Id`],
      entity: props.entityType,
    }
  );
  if (result && !result.error) {
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
  /* position: absolute;
     bottom: 0;
     right: 0; */
}

.lower-right {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
