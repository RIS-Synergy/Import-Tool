<template>
  <div v-for="(x, idx) in model" :key="idx">
    Type: <span class="bold">{{ x.type }}</span>
    <Person v-if="x.person" v-model="x.person" />
  </div>
</template>

<script setup>
const model = defineModel();
</script>

<style scoped>
.bold {
  font-weight: bold;
}
</style>
