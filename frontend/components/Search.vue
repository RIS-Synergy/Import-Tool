<template>
  <v-autocomplete
    v-model="selected"
    v-model:search="searchStr"
    :items="items"
    :loading="loading"
    item-title="title"
    item-value="risId"
    placeholder="Search projects..."
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="compact"
    hide-details
    no-filter
    return-object
    @update:model-value="onSelect"
    :hide-no-data="searchStr.length < 2"
    class="mx-4 search-autocomplete"
    style="max-width: 700px;"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item
        v-bind="props"
        :subtitle="`${item.raw.piName || 'Unknown PI'} — ${item.raw.risId}${item.raw.startDate ? ' (' + item.raw.startDate + (item.raw.endDate ? ' – ' + item.raw.endDate : '') + ')' : ''}`"
      ></v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup>
const { project } = useApiUtils();
const loading = ref(false);
const searchStr = ref("");
const items = ref([]);
const selected = ref(null);

let debounceTimer = null;

watch(searchStr, (val) => {
  if (!val || val.length < 2) {
    items.value = [];
    return;
  }
  
  if (debounceTimer) clearTimeout(debounceTimer);
  
  debounceTimer = setTimeout(async () => {
    loading.value = true;
    try {
      const api = (await project).default;
      const results = await api.search(val);
      items.value = results || [];
    } catch (error) {
      console.error("Search failed:", error);
      items.value = [];
    } finally {
      loading.value = false;
    }
  }, 300);
});

function onSelect(item) {
  if (item && item.risId) {
    navigateTo(`/project/${item.risId}`);
    // Reset selection after navigation so the search box clears or stays ready
    nextTick(() => {
      selected.value = null;
      searchStr.value = "";
    });
  }
}
</script>

<style scoped>
/* Ensure it looks premium and well-integrated */
.search-autocomplete :deep(.v-field__input) {
  padding-top: 0;
  padding-bottom: 0;
  min-height: 40px;
}
</style>
