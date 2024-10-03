<template>
  <v-card-title>
    {{ data.id }} sadfas as dsfsdf sdfsdf
  </v-card-title>
  <v-card-text>
    hello world
  </v-card-text>
  <v-card-actions>
    ff
  </v-card-actions>
  <!-- <pre class="tiny">{{ data }}</pre> -->
</template>

<script setup>
const model = defineModel()

const props = defineProps({
  data: {
    required: true,
  },
});

</script>

<style>
.tiny {
  font-size: 0.5em;
}
</style>
