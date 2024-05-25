<template>
  <div v-for="(x, idx) in model" :key="idx">
    <div v-if="x.by && x.by.by">
      By: <span class="bold">{{ x.by.by.id }}</span>
      <div v-if="x.by.by.type">
        Type: {{ x.by.by.type }}
      </div>
      <LangTrans v-model="x.by.by.name" />
    </div>
    <div v-if="x.as && x.as.as">
      As: {{ x.as.as.id }} <br/>
      <div v-if="x.as.as.type">
        Type: <span class="bold">{{ x.as.as.type }}</span>
      </div>
      <LangTrans v-model="x.as.as.name" />
    </div>
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
