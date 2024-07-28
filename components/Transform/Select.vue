<template>
  <v-row>
    <v-col cols="4">
      <v-select
        v-model="selectedTemplate"
        :items="templates"
        item-title="name"
        item-value="id"
        item-text="description"
        label="Project Template"
        persistent-hint
        hide-details
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props" :subtitle="item.raw.description" />
        </template>
      </v-select>
    </v-col>
    <v-col cols="4">
      <!-- y -->
    </v-col>
    <v-col cols="4">
      <!-- z -->
    </v-col>
  </v-row>
</template>

<script setup>
const templates = ref([]);

// XXX - default project, temporarlily for the demo
const selectedTemplate = ref({
  id: 32,
  name: "Project 1",
});

// emit
const emit = defineEmits(["change"]);

const store = useProjectStore();

const { getTemplates } = useApiUtils();
templates.value = await getTemplates();

const templateItems = computed(() => {
  return templates.value.map((x) => {
    return {
      name: x.name,
      value: x.id,
      description: x.description,
    };
  });
});

watch(selectedTemplate, (newVal) => {
  store.templateId = newVal;
  emit("change", newVal);
});
</script>
