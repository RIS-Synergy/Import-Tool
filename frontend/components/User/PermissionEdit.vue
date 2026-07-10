<template>
  <v-dialog v-model="dialog" max-width="400">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-if="canEdit"
        v-bind="activatorProps"
        icon="mdi-pencil"
        size="small"
        variant="text"
        class="ml-2"
        @click="dialog = true"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card :title="`Edit Permissions for ${user.username}`">
        <v-card-text>
          <v-checkbox
            v-model="permissions"
            label="edit"
            value="edit"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="permissions"
            label="admin"
            value="admin"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="permissions"
            label="superuser"
            value="superuser"
            hide-details
            :disabled="!isSuperuser"
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="save" :loading="loading">Save</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["updated"]);

const store = useUserSettingsStore();
const { users } = useApiUtils();
const { updatePermission } = (await users).default;

const dialog = ref(false);
const loading = ref(false);
const permissions = ref([...props.user.permission]);

const currentUser = computed(() => store.user);
const isSuperuser = computed(() =>
  currentUser.value?.permission?.includes("superuser"),
);
const isAdmin = computed(() =>
  currentUser.value?.permission?.includes("admin"),
);

const canEdit = computed(() => {
  if (isSuperuser.value) return true;
  if (
    isAdmin.value &&
    currentUser.value?.ri === props.user.researchInstitution?.id
  )
    return true;
  return false;
});

async function save() {
  loading.value = true;
  try {
    const result = await updatePermission(props.user.id, permissions.value);
    if (result && !result.error) {
      dialog.value = false;
      emit("updated");
    }
  } finally {
    loading.value = false;
  }
}

// Reset permissions when dialog opens
watch(dialog, (val) => {
  if (val) {
    permissions.value = [...props.user.permission];
  }
});
</script>

<style scoped></style>
