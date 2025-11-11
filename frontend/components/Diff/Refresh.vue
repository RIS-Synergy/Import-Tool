<template>
  <v-btn
    class="mt-3"
    variant="outlined"
    rounded
    color="grey"
    @click="refreshDiff(props.risId, props.systemName, props.uuid)"
  >
    refresh
  </v-btn>
</template>

<script setup>
const props = defineProps({
  risId: {
    type: String,
    required: true,
  },
  systemName: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  }
});

const { diff } = useApiUtils();
const { refreshDiff } = (await diff).default;
</script>

<style scoped>
</style>
