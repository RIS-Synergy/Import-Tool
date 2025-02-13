<template>
  <h3>{{ props.title }}</h3>
  <v-card
    class="my-1"
    :class="templateClass(template.id)"
    elevation="1"
    v-for="template in templates"
    key="template.id"
  >
    <v-card-text>
      <v-row>
        <v-col cols="1">
          <v-icon
            v-if="selected === template.id"
            @click="selected = null"
            icon="mdi-checkbox-marked-circle"
          />
          <v-icon
            v-else
            @click="selected = template.id"
            icon="mdi-checkbox-blank-circle-outline"
          />
        </v-col>
        <v-col cols="8">
          <h4>{{ template.name }}</h4>
          <i class="light-grey"> {{ template.description }}</i>
        </v-col>
        <v-col class="right" cols="3">
          <TransformDialog :templateType="props.templateType" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <TransformDetails
    :entityType="templateType"
    :crisEntities="props.crisEntities"
  />
  <!-- unfortunate limitations for now of backend diff runPipeline -->
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  templateType: {
    type: String,
    required: true,
  },
  crisEntities: {
    type: Array,
    required: true,
  },
});

const store = useProjectStore();

const typeId = props.templateType + "Id";

const templates = ref([]);
// const active = true;
const selected = ref(store.template[typeId]);

const { getTemplates } = useApiUtils();
templates.value = await getTemplates(props.templateType);

function setSelect(val) {
  console.log("setSelect", val);
  store.template[typeId] = val;
}

function saveToStore() {
  console.log("saveToStore", selectedTemplate.value);
  const typeId = props.templateType + "Id";
  store.template[typeId] = selectedTemplate.value;
}

function templateClass(id) {
  let hidden = false;
  if (selected.value && selected.value !== id) {
    hidden = true;
  }
  return {
    hidden,
  };
}

watch(selected, (val) => {
  if (val) {
    setSelect(val);
  } else {
    setSelect(null);
  }
});

// watch(active, (val) => {
//   if (!val) {
//     selected.value = null;
//   }
//   store.transform[props.templateType] = val || false;
// });

const templateId = computed(() => {
  return store.template[typeId];
});

function sameTemplateAsSelected() {
  // console.log(templateId.value)
  // console.log(templates.value)
  // debugger
  // if (props.templateType === "project") {
  //   active.value = true;
  // }
  // if (templates.value.includes(templateId.value)) {
  //   debugger;
  //   active.value = true;
  // }
}

sameTemplateAsSelected();
</script>

<style scoped>
.v-card {
  /* border-color: #eee; */
}

.hidden {
  display: none;
}

.right {
  text-align: right;
}
</style>
