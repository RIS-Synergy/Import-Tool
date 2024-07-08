<template>
  <v-container>

    <v-text-field
      v-for="{ label, value } in storeObject"
      :label="label"
      :value="value"
      />
    </v-container>
</template>

<script setup>
const store = useProjectStore();

const storeObject = computed(() => {
  return Object.entries(store.settings).map(([key, value]) => {
    console.log(key, value)

    return {
      label: key,
      value: value
    };
  });
});

</script>

<style scoped>
</style>
