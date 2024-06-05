<template>
  <v-card>
    <v-card-title>
      <pre v-html="highlightedYaml"></pre>
    </v-card-title>
    <v-card-actions>
      <v-spacer/>
      <v-btn @click="emit('close')" >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import { defineProps } from 'vue'
import yaml from 'js-yaml'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const emit = defineEmits(['close'])

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
  padding: 1em;
  border-radius: 8px;
  font-size: 1em;
}
</style>
