<template>
  <v-dialog v-model="dialog" max-width="400">
    <template v-slot:activator="{ props }">
      <v-btn
        color="error"
        variant="outlined"
        size="small"
        v-bind="props"
        class="ml-2"
      >
        Delete
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h6">Confirm Deletion</v-card-title>
      <v-card-text>
        Are you sure you want to delete <b>{{itemId}}</b>? This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="confirmDelete" :loading="loading">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  itemId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['deleted'])

const dialog = ref(false)
const loading = ref(false)

const confirmDelete = async () => {
  loading.value = true
  try {
    const { fa } = useApiUtils();
    const { deleteFa } = (await fa).default;
    await deleteFa(props.itemId)
    emit('deleted', props.itemId)
    dialog.value = false
  } catch (error) {
    console.error('Error deleting funding agency:', error)
    // You might want to show an error message to the user
  } finally {
    loading.value = false
  }
}
</script>
