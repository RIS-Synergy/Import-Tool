<template>
  <pre v-if="store.isEdit" v-html="highlightedYaml" />
  <pre v-else="!store.isEdit" v-html="pre" />

  <!-- <v-textarea v-model="formattedYaml" @input="updateYaml" /> -->

</template>

<script setup>
import { computed, watchEffect } from "vue";
import yaml from "js-yaml";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const emit = defineEmits(["close"]);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const store = useTemplateStore();

const formattedYaml = computed(() => {
  return yaml.dump(props.data, { indent: 2 });
});

const highlightedYaml = computed(() => {
  return hljs.highlight(formattedYaml.value, { language: "yaml" }).value;
});
</script>

<style scoped>
pre {
  padding: 1em;
  border-radius: 8px;
  font-size: 0.8em;
}
</style>
