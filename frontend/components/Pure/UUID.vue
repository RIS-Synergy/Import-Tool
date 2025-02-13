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
  entity: {
    type: String,
    required: true,
  }
});

const data = ref({});

const { riEntityUUID } = useApiUtils();
data.value = await riEntityUUID(props.entity, props.uuid);
</script>

<style></style>
