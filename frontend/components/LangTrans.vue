<template>
  <v-card
    v-if="Array.isArray(model)"
    v-for="{ lang, trans, text } in model"
    variant="outlined"
    class="mb-1 pa-1 mr-1" >
    <span class="mx-1 text">
      {{ text }}
    </span>
    <v-chip class="trans">
      {{ mapping[trans] }}
    </v-chip>
    <v-chip class="language ml-1">
      {{ lang }}
    </v-chip>
  </v-card>
  <v-card v-else variant="outlined" class="mb-1 pa-1">
    <span class="mx-1 text">
      {{ model.text }}
    </span>
    <v-chip class="model.trans">
      {{ mapping[model.trans] }}
    </v-chip>
    <v-chip class="language ml-1">
      {{ model.lang }}
    </v-chip>
  </v-card>
</template>

<script setup>
const model = defineModel()

const mapping = {
  O: 'Original',
  H: 'Human-Translated',
  M: 'Machine-Translated'
}
</script>

<style scoped>
.v-card {
  border-color: #DDD;
  display: inline-flex;
  align-items: center;
}

.trans {
  /* transformed to the right */
  /* float: right; */
}

.text {
  color: #000;
  font-size: 1.2em;
}
</style>
