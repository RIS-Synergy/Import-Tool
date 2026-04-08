<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="mb-4">Dashboard</h1>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col v-for="i in 5" :key="i" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="stat in displayedStats" :key="stat.title" cols="12" md="4">
        <v-card
          class="pa-4 text-center"
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
const stats = ref({});
const loading = ref(true);

const displayedStats = [
  {
    key: "total",
    title: "All",
    color: "primary",
  },
  {
    key: "notLinked",
    title: "Project not linked to CRIS",
    color: "warning",
  },
  {
    key: "different",
    title: "Project in CRIS, but has differences (Diff)",
    color: "error",
  },
  {
    key: "identical",
    title: "Project in CRIS and has no differences (Identical)",
    color: "success",
  },
  {
    key: "synced",
    title: "Project in CRIS and no difference",
    color: "info",
  },
];

onMounted(async () => {
  try {
    const store = useUserSettingsStore();
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
});
</script>

<style scoped></style>
