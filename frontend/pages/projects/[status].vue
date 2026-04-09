<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(item, index) in serverItems"
        :key="item.id"
        cols="12"
        md="6"
      >
        <v-card v-if="!loading">
          <v-card-title
            >{{ getLang(item.title, "de") }} <br />
            {{ getLang(item.title, "en") }}
          </v-card-title>
          <v-card-text class="pb-3">
            <v-row>
              <v-col cols="8">
                ID:
                <!-- <NuxtLink :to="`/project/${item.id}`">{{ item.id }}</NuxtLink> -->
                {{ item.id }}
                <br />
                PI: <span class="bold">{{ piName(item) }}</span
                ><br />
                Date: {{ item.startDate }} - {{ item.endDate }}<br />
                Status: {{ item.status }}<br />
              </v-col>
              <v-col>
                <!-- btn link -->
                <NuxtLink :to="`/project/${item.id}`">
                  <v-btn
                    variant="outlined"
                    size="small"
                    class="right"
                    color="primary">
                    <!-- <v-icon>mdi-eye-outline</v-icon> -->
                    view
                  </v-btn>
                </NuxtLink>
                <!-- Disable for now  -->
                <!-- <StatusColumn v-if="hasCRIS()" class="bottom-right" :id="item.id" :data="columnData" /> -->
              </v-col>
            </v-row>
            <ExternalEntities :externals="item.externalEntities" />
            <DiffSimple
              class="ml-1 mr-1"
              :diffList="item.diffList" />
          </v-card-text>
        </v-card>
        <v-skeleton-loader
          v-else
          class="mx-auto"
          max-heigth
          elevation="1"
          type="text, text, subtitle, list-item-three-line"
        ></v-skeleton-loader>
      </v-col>
      <v-col cols="12">
        <v-pagination
          v-if="totalItems > 0"
          v-model="page"
          :length="pagesLength"
          :total-visible="15"
          class="my-4 mx-auto"
        ></v-pagination>
      </v-col>
    </v-row>
    Projects: <b>{{ totalItems }}</b>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "projects",
});

useHead({
  title: "Projects",
});

const route = useRoute();
const { project, hasCRIS } = useApiUtils();
const loading = ref(false);
const serverItems = ref([]);
const totalItems = ref(0);
const page = ref(1);

const store = useUserSettingsStore();

// Map route status to diff filter
const slugToDiffFilter = {
  "all": "All",
  "not-linked": "NULL",
  "diff": "DIFFERENT",
  "identical": "IDENTICAL",
  "synced": "SYNCED",
  "incomplete": "NOT_SYNCED"
};

async function loadItems({ page, itemsPerPage, sortBy }, storeFilter = null) {
  if (!store.token) return;

  store.sortBy = sortBy;
  loading.value = true;

  try {
    const { listAll } = (await project).default;
    const filters = { ...(storeFilter || store.projectFilters) };
    
    // Handle 'clear' query param to reset all filters
    if (route.query.clear === "true") {
      console.log("🧹 Clearing filters due to 'clear' query param");
      store.clearFilters();
      // Ensure we use the cleared filters for the immediate load
      Object.assign(filters, store.projectFilters);
    }

    const statusParam = route.params.status;
    if (statusParam && slugToDiffFilter[statusParam]) {
      filters.diffs = slugToDiffFilter[statusParam];
    }

    const result = await listAll({
      page,
      itemsPerPage,
      sortBy,
      filters,
    });

    if (result) {
      const { total, items } = result;
      serverItems.value = items.map((x) => {
        return {
          ...x.risData,
          externalEntities: x.externalEntities,
          diffList: x.diffList,
          diffLength: x.diffLength
        }
      });
      totalItems.value = total;
    }
  } catch (error) {
    console.error("❌ loadItems failed:", error);
  } finally {
    loading.value = false;
  }
}

function getLang(item, lang) {
  try {
    return item.find((x) => x.lang === lang).text;
  } catch (error) {
    return "";
  }
}

function piName(x) {
  try {
    return (
      x.team[0].person.personName.firstName +
      " " +
      x.team[0].person.personName.familyName
    );
  } catch (error) {
    return "";
  }
}

const columnData = computed(() => {
  return {
    uuid: null
  }
});

function updateItemsPerPage(idx) {
  store.projectFilters.itemsPerPage = idx;
}

const pagesLength = computed(() => {
  const itemsPerPage = store.projectFilters?.itemsPerPage || 10;
  return Math.ceil(totalItems.value / itemsPerPage);
});

watch(
  () => JSON.stringify(store.projectFilters),
  (newVal, oldVal) => {
    if (newVal === oldVal) return;
    console.log("👀 store.projectFilters changed", newVal);
    loadItems(
      { page: 1, itemsPerPage: store.projectFilters.itemsPerPage, sortBy: store.sortBy },
      store.projectFilters,
    );
  }
);

// Also watch route changes
watch(
  () => [route.params.status, route.query.clear],
  () => {
    page.value = 1;
    loadItems(
      { page: 1, itemsPerPage: store.projectFilters.itemsPerPage, sortBy: store.sortBy },
      store.projectFilters,
    );
  }
);

onMounted(() => {
  console.log("🚀 [status].vue mounted, initial load for", route.params.status);
  loadItems(
    { page: 1, itemsPerPage: store.projectFilters.itemsPerPage, sortBy: store.sortBy },
    store.projectFilters,
  );
});

watch(page, () => {
  console.log("📄 page changed to", page.value);
  loadItems(
    {
      page: page.value,
      itemsPerPage: store.projectFilters.itemsPerPage,
      sortBy: store.sortBy,
    },
    store.projectFilters,
  );
});

</script>

<style scoped>
a {
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

/* make the dates a bit wider */
.date {
  min-width: 6em;
}

.bold {
  font-weight: bold;
}

.right {
  float: right;
}
</style>
