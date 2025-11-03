<template>
  <div v-for="(x, idx) in model" :key="idx">
    Type: <span class="bold">{{ x.type }}</span>
    <Person v-if="x.person && cris && cris.id" v-model="x.person" />
  </div>
</template>

<script setup>
const model = defineModel();

const { cris } = useUserSettingsStore()
</script>

<style scoped>
.bold {
  font-weight: bold;
}
</style>
