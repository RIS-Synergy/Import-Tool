<template>
      <v-select
        v-model="selectedTemplate"
        :items="templates"
        autofocus
        item-title="name"
        item-value="id"
        item-text="description"
        label="Template"
        persistent-hint
        hide-details
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props" :subtitle="item.raw.description" />
        </template>
      </v-select>
</template>

<script setup>
const templates = ref([]);

const selectedTemplate = ref(null);

const props = defineProps({
  templateType: String,
  required: true
});

const emit = defineEmits(["change"]);

const store = useProjectStore();

const { getTemplates } = useApiUtils();
templates.value = await getTemplates(props.templateType);

const templateItems = computed(() => {
  return templates.value.map((x) => {
    return {
      name: x.name,
      value: x.id,
      description: x.description,
    };
  });
});

selectedTemplate.value = templateItems.value[0].value;
const typeId = props.templateType + 'Id'
store.template[typeId] = selectedTemplate.value;

// console.log(typeId, selectedTemplate.value)

watch(selectedTemplate, (newVal) => {
  const typeId = props.templateType + 'Id'
  console.log('type', typeId, newVal)
  store.template[typeId] = newVal;
  emit("change", newVal);
});
</script>
