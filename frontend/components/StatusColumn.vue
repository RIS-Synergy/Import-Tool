<template>
  <v-dialog v-if="data.uuid" max-width="800">
    <template v-slot:activator="{ props: activatorProps }">
      <v-chip class="text-none" v-bind="activatorProps" color="light-green">
        active
      </v-chip>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="CRIS Status">
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <span class="label"> UUID </span>
            </v-col>
            <v-col cols="10">
              {{ data.uuid }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <span class="label"> CRIS ID </span>
            </v-col>
            <v-col cols="10">
              {{ data.crisId }}
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>

  <span v-else>
    <v-progress-circular v-if="loading" color="#ffaa60" size="25" indeterminate>
    </v-progress-circular>
    <v-chip
      v-else-if="!loading && likelihood.likelihood >= 0.5"
      class="text-none"
      v-bind="activatorProps"
      color="#ff60aa"
    >
      likely
    </v-chip>
    <v-chip v-else class="text-none" v-bind="activatorProps" color="#ffaa60">
      unknown
    </v-chip>
  </span>
</template>

<script setup>
const props = defineProps({
  data: Object,
  id: String,
});

const loading = ref(true);

const { diffRILikelihood } = useApiUtils();

const likelihood = ref(null);

if (!props.data.uuid) {
  likelihood.value = await diffRILikelihood(props.id).then((result) => {
    console.log("likelihood", result);
    loading.value = false;
    return result;
  });
}

onMounted(() => {
  console.log("mounted", props.id);
});
</script>

<style scoped>
.label {
  font-weight: bold;
}
</style>
