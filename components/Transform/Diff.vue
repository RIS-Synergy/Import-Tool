<template>
  <v-row>
    <v-col cols="6">
      Transformation Template
      <Yaml :json="formattedJson.output" :tab="1" />

    </v-col>
    <v-col cols="6">
      Transformation Result
      <Yaml :json="result" :tab="1" />

    </v-col>
  </v-row>

</template>


<script setup>
import yaml from "js-yaml";

const props = defineProps({
  template: {
    type: String,
    required: true,
  },
  result: {
    type: Object,
    required: true,
  },
});

const formattedJson = computed(() => {
  // transform from Yaml
  // return props.json
  return yaml.load(props.template);
});



</script>
