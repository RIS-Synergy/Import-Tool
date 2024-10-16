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
            v-model="store.projectFilters"
            :items="projectStatus"
            label="Status"
            chips
            multiple
            outlined
          ></v-select>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="Clear Filters"
            @click="clearFilters"
          </v-btn>

          <v-btn
            v-if="false"
            text="Apply Filter"
            @click="applyFiler(); isActive.value = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const dialog = ref(false);

// const status = ref(null);

const projectStatus = [
  "IN_PREPERATION",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
];

function clearFilters () {
  store.projectFilters = [];

  dialog.value = false;
}

const filterIcon = computed(() => {
  console.log(store.projectFilters.length)

  if (store.projectFilters.length > 0) {
    return 'mdi-filter'
  } else {
    return 'mdi-filter-outline'
  }
})

const store = useUserSettingsStore()

function applyFiler () {
}
</script>
