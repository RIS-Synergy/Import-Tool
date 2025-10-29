<template>
  <AppBar title="Funding Agencies" />
  <v-table density="compact">
    <thead>
      <tr>
        <th>ID</th>
        <th>Acronym</th>
        <th>Name</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.id">
        <td>{{ item.id }}</td>
        <td>
          {{ item.data.acronym }}
        </td>
        <td>
          {{ item.data.name }}
        </td>
        <td>
          <v-btn variant="outlined" size="small" @click="startSync(item.id)">
            Sync
          </v-btn>
          <FADeleteButton :item-id="item.id" @deleted="handleDeleted" />
          <FAFormButton
            :item-id="item.id"
            @submitted="(formData) => handleFormSubmit(formData, item.id)"
          />
        </td>
      </tr>
    </tbody>
  </v-table>
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
