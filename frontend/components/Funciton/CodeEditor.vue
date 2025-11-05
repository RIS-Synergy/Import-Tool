<template>
  <pre v-if="store.isEdit" v-html="highlightedYaml" />

  <v-ace-editor
    v-else
    v-model:value="textData"
    :lang="props.lang"
    :options="options.value"
    theme="github_light_default"
    onChange="textData = $event"
    style="height: 60em"
  />

  <v-row class="mt-2 mb-2">
    <v-spacer></v-spacer>
    <v-btn variant="tonal" class="ml-2" @click="editOrView">
      {{ store.isEdit ? "Edit" : "View" }}
    </v-btn>
    <v-btn v-if="!store.isEdit" color="primary" class="ml-2" @click="save">
      Save
    </v-btn>
  </v-row>
</template>

<script setup>
import yaml from "js-yaml";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github_light_default";
import "ace-builds/src-noconflict/theme-xcode";

const emit = defineEmits(["close", "save"]);

const props = defineProps({
  data: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    default: "javascript",
  },
});

const store = useFunctionStore()
const projectStore = useProjectStore()

const textData = ref(props.data);

const options = {
  // enableBasicAutocompletion: true,
  // enableSnippets: true,
  // enableLiveAutocompletion: true,
};

const highlightedYaml = computed(() => {
  return hljs.highlight(textData.value, { language: props.lang }).value;
});

const { functions } = useApiUtils();
const { setFunction } = (await functions).default;

const alert = useAlertStore()

const error = ref(null);
const okResult = ref(null);

function editOrView() {
  store.toggleEdit();
  error.value = null;
  okResult.value = null;
}

const route = useRoute();
const functionName = route.params.id

async function save() {
  error.value = null;
  okResult.value = null;
  const updated = await setFunction(
    functionName, textData.value,
    projectStore.lastTemplate.input,
    projectStore.lastTemplate.settings)
  if (updated.error) {
    // setError(updated.error);
    alert.setError(updated.error)
  } else {
    okResult.value = updated; // XXX do we need this??
    textData.value = updated.code;
    alert.setInfo("Function updated", updated.output)
  }
}
</script>

<style scoped>
pre {
  font-size: 1em;
  line-height: 1.25em;
}
</style>
