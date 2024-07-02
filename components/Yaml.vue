<template>
  <v-card>
    <v-card-title>
      <v-tabs v-model="tab">
        <v-tab :value="1">YAML</v-tab>
        <v-tab :value="2">JSON</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item :value="1">
          <pre v-html="highlightedYaml"></pre>
        </v-tabs-window-item>
        <v-tabs-window-item :value="2">
          <pre v-html="highlightedJson"></pre>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-title>
    <v-card-actions v-if="false">
      <!-- i dont know where 'close' is needed -->
      <v-spacer />
      <v-btn @click="emit('close')"> Close </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, watchEffect } from "vue";
import yaml from "js-yaml";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const emit = defineEmits(["close"]);

const props = defineProps({
  json: {
    type: Object,
    required: true,
  },
  tab: {
    type: Number,
    default: 1 // 2: JSON
  }
});

const tab = ref(props.tab);

const formattedYaml = computed(() => {
  return yaml.dump(props.json, { indent: 2 });
});

const formattedJson = computed(() => {
  return props.json
});

const highlightedYaml = computed(() => {
  return hljs.highlight(formattedYaml.value, { language: "yaml" }).value;
});

const highlightedJson = computed(() => {
  return hljs.highlight(JSON.stringify(formattedJson.value, null, 2), { language: "json" }).value;
});
</script>

<style scoped>
pre {
  padding: 1em;
  border-radius: 8px;
  font-size: 0.8em;
}
</style>
