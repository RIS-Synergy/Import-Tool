<template>
  <v-card>
    <pre v-html="highlightedYaml"></pre>
  </v-card>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import { defineProps } from 'vue'
import yaml from 'js-yaml'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps({
  json: {
    type: Object,
    required: true
  }
})

const formattedYaml = computed(() => {
  return yaml.dump(props.json, { indent: 2 })
})

const highlightedYaml = computed(() => {
  return hljs.highlight(formattedYaml.value, { language: 'yaml' }).value
})
</script>

<style scoped>
pre {
  background-color: #f5f5f5;
  padding: 1em;
  border-radius: 8px;
  font-size: 1em;
}
</style>
