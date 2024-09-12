<template>
  <pre v-if="store.isEdit" v-html="highlightedYaml" />

  <v-ace-editor
    v-else
    v-model:value="textData"
    lang="yaml"
    :options="options.value"
    theme="github_light_default"
    onChange="textData = $event"
    style="height: 60em" />

  <v-row class="mt-2 mb-2">
    <v-spacer></v-spacer>
    <v-btn variant="tonal" class="ml-2" @click="store.toggleEdit">
      {{ store.isEdit ? "Edit" : "View" }}
    </v-btn>
    <v-btn
      v-if="!store.isEdit"
      color="primary"
      class="ml-2"
      @click="save"
    >
      Save
    </v-btn>
  </v-row>

  <v-alert
    v-if="error"
    variant="outlined"
    :title="error.name"
    type="error"
  >
    {{ error.reason }}
    <br/>
    <pre>
      {{ error.mark }}
    </pre>
  </v-alert>
  <v-alert
    v-if="okResult"
    title="Template saved"
    variant="outlined"
    type="success"
  >
    <pre>
      {{ okResult }}
    </pre>
    </v-alert>
</template>

<script setup>
// import { computed, watchEffect } from "vue";
import yaml from "js-yaml";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github_light_default';
import 'ace-builds/src-noconflict/theme-xcode';

const emit = defineEmits(["close", "save"]);

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

const textData = ref(formattedYaml.value);

const options = {
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,

  addCommand: [
    {
      name: 'save',
      bindKey: { win: 'Ctrl-S', mac: 'Command-S', linux: 'Ctrl-S' },
      exec: () => {
        console.log('save')
      }
    },
    {
      name: 'autoComplete',
      bindKey: { win: 'Ctrl-Space', mac: 'Command-Space' },
      exec: () => {
        console.log('autoComplete')
      }
    }
  ]
}

const highlightedYaml = computed(() => {
  return hljs.highlight(formattedYaml.value, {language: "yaml",}).value;
});

const { verifyTemplate } = useApiUtils();

const error = ref(null);
const okResult = ref(null);

async function save () {
  error.value = null;
  okResult.value = null;
  const result = await verifyTemplate(textData.value);
  if (result.error) {
    error.value = result.error;
    return;
  } else {
    okResult.value = result;
  }
}

</script>

<style scoped>
pre {
  font-size: 0.7em;
  line-height: 1.25em;
}
</style>
