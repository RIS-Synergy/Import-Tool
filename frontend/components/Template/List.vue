<template>
  <v-container>
    <div v-if="fale" class="text-h4 mb-2">Templates: {{ templateType }}</div>
    <v-row>
      <v-col cols="6" v-for="item in data" :key="item.id">
        <v-card>
          <v-card-title>
            {{ item.name }}
          </v-card-title>
          <v-card-text>
            {{ item.description }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="false" :to="`${templateType}/${item.id}`">
              Edit
            </v-btn>
            <v-btn :to="`${templateType}/${item.id}`"> View </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- dialog with fab for a Create form -->
    <v-dialog v-model="dialog" max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <v-fab
          color="primary"
          icon="mdi-plus"
          class="mb-4"
          location="bottom end"
          app
          @click="dialog = true"
        ></v-fab>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card :title="newTemplateTitle">
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field v-model="name" label="Name" required :rules="fieldRules"></v-text-field>
              <v-textarea
                v-model="description"
                label="Description"
                :rules="fieldRules"
                required
              ></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="create"> Create </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-container>
</template>

<script setup>
const props = defineProps({
  templateType: String,
});

const dialog = ref(false);
const name = ref("");
const description = ref("");

const store = useTemplateStore();

const form = ref(null);

const fieldRules = [
  (v) => !!v || "Field is required",
];

const { createTemplate } = useApiUtils();

async function create() {
  const { valid } = await form.value.validate()

  if (!valid) {
    console.log("Form is not valid")
    return;
  } else {
    const result = await createTemplate(
      props.templateType,
      name.value,
      description.value,
    );
    console.log("result", result);
    dialog.value = false;
    getListData();
  }
}

// 1st letter capitalized
const newTemplateTitle = `New ${props.templateType.charAt(0).toUpperCase() + props.templateType.slice(1)} template`;

const { getTemplates } = useApiUtils();
const data = ref([]);

async function getListData () {
  data.value = await getTemplates(props.templateType);
}

getListData();
</script>
