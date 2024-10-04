<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        :icon="filterIcon"
        variant="flat"
      >
        <v-icon :icon="filterIcon"></v-icon>
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Filters">
        <v-card-text>
          <v-select
            v-model="status"
            :items="projectStatus"
            label="Status"
            outlined
          ></v-select>
        </v-card-text>

        <v-card-actions>
          <v-btn
            text="Clear Filters"
            @click="clearFilters"
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn
            text="Apply Filter"
            @click="isActive.value = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const dialog = ref(false);

const status = ref(null);

const projectStatus = [
  "IN_PREPERATION",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
];

function clearFilters () {
  status.value = null;

  dialog.value = false;
}

const filterIcon = computed(() => {
  if (status.value) {
    return 'mdi-filter'
  } else {
    return 'mdi-filter-outline'
  }
})
</script>
