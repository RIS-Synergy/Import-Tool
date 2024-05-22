<template>
  <v-card
    v-for="{ lang, trans, text } in model"
    variant="outlined"
    class="mb-1" >
    <v-chip class="trans float-right">
      {{ mapping[trans] }}
    </v-chip>
    <v-chip class="language float-right">
      {{ lang }}
    </v-chip>
    {{ text }}
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
  border-color: #999;
}

.trans {
  /* transformed to the right */
  float: right;
}
</style>
