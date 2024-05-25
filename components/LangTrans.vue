<template>
  <v-card
    v-if="Array.isArray(model)"
    v-for="{ lang, trans, text } in model"
    variant="outlined"
    class="mb-1 pa-1" >
    <v-chip class="trans float-right">
      {{ mapping[trans] }}
    </v-chip>
    <v-chip class="language float-right">
      {{ lang }}
    </v-chip>
    {{ text }}
  </v-card>
  <v-card v-else variant="outlined" class="mb-1 pa-1">
    <v-chip class="model.trans float-right">
      {{ mapping[model.trans] }}
    </v-chip>
    <v-chip class="language float-right">
      {{ model.lang }}
    </v-chip>
    {{ model.text }}
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
}

.trans {
  /* transformed to the right */
  float: right;
}
</style>
