<template>
  <AppBar title="Functions" />

  <v-container>
    <v-card v-for="f in data" class="mb-1">
      <v-card-title>{{ f.name }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :to="`functions/${f.name}`">View</v-btn>
      </v-card-actions>
    </v-card>

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
              <!-- asterisk label -->
              <v-text-field
                v-model="name"
                label="Name *"
                required
                :rules="fieldRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="createOrUpdate"> {{ titleCreateOrUpdate }} </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-container>
</template>

<script setup>
const { functions } = useApiUtils();
const { getFunctions, createFunction } = (await functions).default;

const data = await getFunctions();
const dialog = ref(false);
const form = ref(null);
const name = ref("");
const fieldRules = [(v) => {
  // regex to check for alphanumeric characters including underscore
  const pattern = /^[a-zA-Z0-9_]*$/;
  if (!v) {
    return "Field is required";
  } else if (!pattern.test(v)) {
    return "Only alphanumeric characters and underscores are allowed";
  } else {
    return true;
  }
}];

definePageMeta({
  // layout: "functions"
});

const titleCreateOrUpdate = computed(() => {
  // return store.templateId ? "Update" : "Create";
  return 'Create'
});

async function createOrUpdate() {
  const { valid } = await form.value.validate();

  if (!valid) {
    console.log("Form is not valid");
    return;
  } else {
    const result = await createFunction(
      name.value,
    );
    console.log("result", result);
    name.value = "";
    dialog.value = false;
    getListData();
  }
}

async function getListData() {
  data.value = await getFunctions();
}
</script>
