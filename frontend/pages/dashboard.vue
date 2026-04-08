<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="mb-4">Dashboard</h1>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else class="align-stretch">
      <v-col v-for="stat in displayedStats" :key="stat.title" cols="12" md="4" class="d-flex">
        <v-card
          class="pa-4 text-center cursor-pointer clickable-card flex-grow-1 d-flex flex-column justify-center"
          :to="`/projects/${stat.slug}`"
        >
          <div class="">
            {{ stat.title }}
          </div>
          <div
            class="text-h5"
            :class="'text-' + (stat.color || 'primary')"
          >
            {{ stats[stat.key] || 0 }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { apiCall } = useApiUtils();
const store = useUserSettingsStore();
const stats = ref({});
const loading = ref(true);

const displayedStats = computed(() => {
  const activeStatuses = store.projectFilters?.status || [];
  const statusLabels = activeStatuses.length > 0 ? ` (${activeStatuses.join(", ")})` : "";

  return [
    {
      key: "totalRI",
      title: "All Projects in Research Institution",
      color: "grey-darken-2",
      slug: "really-all",
    },
    {
      key: "total",
      title: `All${statusLabels}`,
      color: "primary",
      slug: "all",
    },
    {
      key: "notLinked",
      title: "Project not linked to CRIS",
      color: "warning",
      slug: "not-linked",
    },
    {
      key: "different",
      title: "Project in CRIS, but has differences (Diff)",
      color: "error",
      slug: "diff",
    },
    {
      key: "identical",
      title: "Project in CRIS and has no differences (Identical)",
      color: "success",
      slug: "identical",
    },
    {
      key: "synced",
      title: "Project in CRIS and no difference",
      color: "info",
      slug: "synced",
    },
  ];
});

async function fetchStats() {
  loading.value = true;
  try {
    const result = await apiCall("project2/stats", "POST", {
      body: JSON.stringify({
        filters: store.projectFilters,
      }),
    });
    if (result) {
      stats.value = result;
    }
  } catch (error) {
    console.error("❌ Failed to fetch stats:", error);
  } finally {
    loading.value = false;
  }
}

// Refetch stats when filters change
watch(
  () => JSON.stringify(store.projectFilters),
  () => {
    fetchStats();
  }
);

onMounted(() => {
  fetchStats();
});
</script>

<style scoped></style>
