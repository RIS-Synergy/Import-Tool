<template>
  <v-card>
    <Yaml :json="data" />
  </v-card>
</template>

<script setup>
const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
  systemName: {
    type: String,
    required: true,
  },
});

const data = ref({});

const { cris } = useApiUtils();
const { referenceApi } = (await cris).default;

data.value = await referenceApi(props.systemName, props.uuid);
</script>

<style></style>
