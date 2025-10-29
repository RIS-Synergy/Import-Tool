<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props }">
      <v-btn
        color="primary"
        variant="outlined"
        size="small"
        v-bind="props"
        class="ml-2"
      >
        {{ itemId ? "Edit" : "Add" }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        {{ itemId ? "Edit Funding Agency" : "Add Funding Agency" }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="formData.clientId"
            label="Client ID"
            :rules="[requiredRule]"
            variant="outlined"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="formData.clientSecret"
            label="Client Secret"
            :rules="[requiredRule]"
            variant="outlined"
            type="password"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleSubmit"
          :loading="loading"
          :disabled="!valid"
        >
          {{ itemId ? "Update" : "Create" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, watch } from "vue";

const props = defineProps({
  itemId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["submitted"]);

const dialog = ref(false);
const form = ref(null);
const valid = ref(false);
const loading = ref(false);

const formData = reactive({
  clientId: "",
  clientSecret: "",
});

const requiredRule = (value) => {
  return !!value || "This field is required";
};

// Reset form when dialog opens/closes
watch(dialog, (isOpen) => {
  if (isOpen) {
    // If we're editing, we need to fetch the current data
    if (props.itemId) {
      fetchFundingAgencyData();
    } else {
      // Reset form for new item
      formData.clientId = "";
      formData.clientSecret = "";
      form.value?.resetValidation();
    }
  }
});

const fetchFundingAgencyData = async () => {
  try {
    const { fa } = useApiUtils();
    const { listAll } = (await fa).default;
    const fundingAgencies = await listAll();
    const agency = fundingAgencies.find((a) => a.id === props.itemId);

    if (agency) {
      formData.clientId = agency.clientId || "";
      formData.clientSecret = agency.clientSecret || "";
    }
  } catch (error) {
    console.error("Error fetching funding agency data:", error);
  }
};

const handleSubmit = async () => {
  const { valid: formValid } = await form.value.validate();

  if (formValid) {
    loading.value = true;
    try {
      emit("submitted", { ...formData });
      dialog.value = false;
    } finally {
      loading.value = false;
    }
  }
};
</script>
