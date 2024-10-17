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
            v-model="store.projectFilters.status"
            :items="projectStatus"
            label="Status"
            chips
            multiple
            outlined
            clearable
          ></v-select>
        </v-card-text>

        <v-card-actions v-if="false">
          <v-spacer></v-spacer>
          <v-btn
            v-if="false"
            text="Clear Filters"
            @click="clearFilters" />
          <v-btn
            v-if="false"
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

// const status = ref(null);

const projectStatus = [
  "IN_PREPERATION",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
];

function clearFilters () {
  store.projectFilters.status = [];

  dialog.value = false;
}

const filterIcon = computed(() => {
  console.log(store.projectFilters.status.length)

  if (store.projectFilters.status.length > 0) {
    return 'mdi-filter'
  } else {
    return 'mdi-filter-outline'
  }
})

const store = useUserSettingsStore()
const projectStore = useProjectStore()

watch(() => store.projectFilters, (value) => {
  console.log(value.value, 'store.projectFilters')
})
</script>
