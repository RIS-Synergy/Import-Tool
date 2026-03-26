<template>
  <v-dialog v-model="dialog" min-width="500" max-width="800">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" :icon="filterIcon" variant="flat">
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
          <v-autocomplete
            v-model="store.projectFilters.piDomain"
            :items="projectStatusDomain"
            label="Research Institution"
            chips
            :clearable="false"
            :multiple="false"
            :rules="[v => !!v || 'Research Institution is required']"
            outlined
          ></v-autocomplete>
          <v-select
            v-model="store.projectFilters.diffs"
            :items="diffs"
            label="Diffs"
            chips
            outlined
          ></v-select>
          <v-select
            v-model="store.projectFilters.orderBy"
            :items="orderBy"
            label="Order by"
            chips
            outlined
          ></v-select>
          <v-select
            v-model="store.projectFilters.itemsPerPage"
            :items="itemsPerPage"
            label="Items per page"
            chips
            outlined
          ></v-select>
        </v-card-text>

        <v-card-actions v-if="false">
          <v-spacer></v-spacer>
          <v-btn v-if="false" text="Clear Filters" @click="clearFilters" />
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

const projectStatus = [
  "IN_PREPARATION",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
];

const projectStatusDomain = ref([]);

const { apiCall } = useApiUtils();

onMounted(async () => {
  projectStatusDomain.value = (await apiCall("institution/list"))
    .map((domain) => {
      return {
        value: { domain: domain.domain, ror: domain.ror },
        title: domain.name,
      };
    });
})

const diffs = [
  {
    value: "All",
    title: "All",
  },
  {
    value: "NULL",
    title: "Project not linked to CRIS",
  },
  {
    value: "IDENTICAL",
    title: "Project in CRIS and has no differences (Identical)",
  },
  {
    value: "DIFFERENT",
    title: "Project in CRIS, but has differences (Diff)",
  },
  {
    value: "SYNCED",
    title: "Project in CRIS and no difference",
  },
];

const orderBy = [
  {
    value: "startDate:asc",
    title: "Start Date, ascending",
  },
  {
    value: "startDate:desc",
    title: "Start Date, descending",
  },
  {
    value: "endDate:asc",
    title: "End Date, ascending",
  },
  {
    value: "endDate:desc",
    title: "End Date, descending",
  },
];

const itemsPerPage = [
  { value: 6, title: "6" },
  { value: 8, title: "8" },
  { value: 10, title: "10" },
  { value: 20, title: "20" },
  { value: 30, title: "30" },
  { value: 40, title: "40" },
  { value: 50, title: "50" },
  { value: 100, title: "100" },
];

const store = useUserSettingsStore();
const projectStore = useProjectStore();

function clearFilters() {
  store.projectFilters.clearFilters();
  dialog.value = false;
}

const filterIcon = computed(() => {
  if (store.projectFilters.status.length > 0) {
    return "mdi-filter";
  } else {
    return "mdi-filter-outline";
  }
});

watch(
  () => store.projectFilters,
  (value) => {
    console.log(value.value, "store.projectFilters");
  },
);
</script>
