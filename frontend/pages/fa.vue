<template>
  <AppBar title="Funding Agencies" />
  <v-container>
    <v-row>
      <v-col
        v-for="item in data"
        :key="item.id"
        cols="12"
      >
        <v-card >
          <v-card-title>
            {{ item.data.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ item.data.acronym }}
          </v-card-subtitle>
          <v-card-text>
            <div><strong>ID:</strong> {{ item.id }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="outlined" @click="startSync(item.id)">
              Sync
            </v-btn>
            <FADeleteButton :item-id="item.id" @deleted="handleDeleted" />
            <FAFormButton
              :item-id="item.id"
              @submitted="(formData) => handleFormSubmit(formData, item.id)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const { fa } = useApiUtils();
const { listAll, startSync, createFa, updateFa } = (await fa).default;
const data = ref(await listAll());

const handleFormSubmit = async (formData, itemId) => {
  try {
    if (itemId) {
      await updateFa(itemId, formData);
    } else {
      await createFa(formData);
    }

    data.value = await listAll();
  } catch (error) {
    console.error("Error saving funding agency:", error);
  }
};

const handleDeleted = (deletedId) => {
  data.value = data.value.filter((item) => item.id !== deletedId);
};
</script>
