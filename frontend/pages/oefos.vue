<script setup lang="ts">
const { loadAll, getTree, loading } = useOefos();
const store = useOefosStore();

const lang = ref<"de" | "en">("de");
const tree = computed(() => getTree(lang.value));

const selectedEntries = computed(() => {
  return store.selectedCodes.map(code => {
    return store.entries[lang.value].find(e => e.Code === code)
  }).filter(e => !!e) as any[]
});

onMounted(async () => {
  await loadAll();
});
</script>

<template>
    <v-card-title class="d-flex align-center">
      <v-icon start icon="mdi-file-tree" />
      OeFOS 2012
      <div v-if="selectedEntries.length" class="ml-4 d-flex align-center flex-wrap" style="gap: 6px;">
        <v-chip
          v-for="entry in selectedEntries"
          :key="entry.Code"
          color="primary"
          size="small"
          variant="tonal"
          closable
          @click:close="store.toggleSelection(entry.Code)"
        >
          <span class="mr-1 font-weight-bold">{{ entry.Code }}</span> {{ entry.Titel }}
        </v-chip>
        <v-btn
          v-if="selectedEntries.length > 1"
          variant="text"
          size="x-small"
          color="secondary"
          @click="store.selectedCodes = []"
          class="ml-2"
        >
          Clear all
        </v-btn>
      </div>
      <v-spacer />
      <v-btn-toggle v-model="lang" mandatory density="compact">
        <v-btn value="de">DE</v-btn>
        <v-btn value="en">EN</v-btn>
      </v-btn-toggle>
    </v-card-title>
    <v-divider class="my-4" />
    <v-card-text>
      <div v-if="loading && !tree.length" class="d-flex justify-center pa-8">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else-if="tree.length === 0" class="text-center pa-8">
        No data available.
      </div>
      <div v-else class="oefos-tree-container">
        <OefosTree :nodes="tree" />
      </div>
    </v-card-text>
</template>

<style scoped>
.oefos-tree-container {
  max-height: 80vh;
  overflow-y: auto;
  padding: 16px;
  background-color: transparent;
}
</style>
