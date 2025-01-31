<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(item, index) in serverItems"
        :key="item.id"
        cols="12"
        md="6"
      >
        <v-card class="">
          <v-card-title
            >{{ getLang(item.title, "de") }} <br />
            {{ getLang(item.title, "en") }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                ID:
                <NuxtLink :to="`/project/${item.id}`">{{ item.id }}</NuxtLink>
                <br />
                PI: <span class="bold">{{ piName(item) }}</span
                ><br />
                Date: {{ item.startDate }} - {{ item.endDate }}<br />
                Status: {{ item.status }}<br />
              </v-col>
              <v-col> ... </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-pagination
        v-if="totalItems > 0"
        v-model="page"
        :length="pagesLength"
        class="my-4"
      ></v-pagination>
    </v-row>
  </v-container>
</template>

<script setup>
const loading = ref(false);
const serverItems = ref([]);
const totalItems = ref(0);
const page = ref(1);

const { getProjectsList } = useApiUtils();
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

  serverItems.value = items.map((x) => x.risData);
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

const store = useUserSettingsStore();
function updateItemsPerPage(idx) {
  store.itemsPerPage = idx;
}

const pagesLength = computed(() => {
  return Math.ceil(totalItems.value / store.itemsPerPage);
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
</style>
