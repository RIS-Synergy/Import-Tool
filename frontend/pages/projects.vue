<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(item, index) in serverItems"
        :key="item.id"
        cols="12"
        md="6"
      >
        <v-card v-if="!loading" class="">
          <v-card-title
            >{{ getLang(item.title, "de") }} <br />
            {{ getLang(item.title, "en") }}
          </v-card-title>
          <v-card-text>
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
                <StatusColumn v-if="hasCRIS()" class="bottom-right" :id="item.id" :data="columnData" />
              </v-col>
            </v-row>
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
      <v-pagination
        v-if="totalItems > 0"
        v-model="page"
        :length="pagesLength"
        :total-visible="15"
        class="my-4 mx-auto"
      ></v-pagination>
    </v-row>
    Projects: <b>{{ totalItems }}</b>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "projects",
});

const loading = ref(false);
const serverItems = ref([]);
const totalItems = ref(0);
const page = ref(1);

const { getProjectsList, hasCRIS } = useApiUtils();
async function loadItems({ page, itemsPerPage, sortBy }, storeFilter = null) {
  store.sortBy = sortBy;
  loading.value = true;

  const filters = storeFilter || store.projectFilters;

  const { total, items } = await getProjectsList({
    page,
    itemsPerPage,
    sortBy,
    filters,
  });

  serverItems.value = items.map((x) => {
    return {
      ...x.risData,
      diffList: x.diffList,
      diffLength: x.diffLength
    }
  });
  totalItems.value = total;
  loading.value = false;
}

function getLang(item, lang) {
  try {
    return item.find((x) => x.lang === lang).text;
  } catch (error) {
    console.log(item);
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
    console.error(error);
    return "";
  }
}

const columnData = computed(() => {
  return {
    uuid: null
  }
});

const store = useUserSettingsStore();

function updateItemsPerPage(idx) {
  store.itemsPerPage = idx;
}

const pagesLength = computed(() => {
  return Math.ceil(totalItems.value / store.projectFilters.itemsPerPage);
});

watch(
  store.projectFilters,
  () => {
    loadItems(
      { page: 1, itemsPerPage: store.itemsPerPage, sortBy: store.sortBy },
      store.projectFilters,
    );
  },
  { deep: true },
);

onMounted(() => {
  loadItems(
    { page: 1, itemsPerPage: store.itemsPerPage, sortBy: store.sortBy },
    store.projectFilters,
  );
});

watch(page, () => {
  loadItems(
    {
      page: page.value,
      itemsPerPage: store.itemsPerPage,
      sortBy: store.sortBy,
    },
    store.projectFilters,
  );
});

// const items_per_page_options = [
//   { value: 10, title: "10" },
//   { value: 15, title: "15" },
//   { value: 20, title: "20" },
//   { value: 25, title: "25" },
// ];
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

:deep(.v-chip) {
  position: absolute;
  right: 1em;
  bottom: 1em;
}

.right {
  float: right;
}
</style>
