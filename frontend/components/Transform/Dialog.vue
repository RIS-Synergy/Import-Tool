<template>
  <v-dialog max-width="1800">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        text="Template"
        @click="onClickView"
        variant="outlined"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-text>
          <TransformDiff
            v-if="store.template.data"
            :template="store.template.data.yamlTemplate"
            :result="store.template.data.transformationResult"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const isActive = ref(false);

const props = defineProps({
  templateType: String,
  templateId: Number,
});

const { template } = useProjectStore();

// const id = computed(() => template[props.templateType + "Id"]);
const store = useProjectStore();

const { transform } = useApiUtils();
const { loadTransformation } = (await transform).default;

function onClickView () {
  // loadTransformation(store, id.value, props.templateType)
  loadTransformation(store, props.templateId, props.templateType)
}
</script>
