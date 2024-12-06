<template>
  <div>
    <PureTable :data="crisEntities" />
  </div>
</template>

<script setup>
const props = defineProps({
  entityType: {
    type: String,
    required: true,
  },
  crisEntities: {
    type: Array,
    default: () => [],
  },
});
</script>
