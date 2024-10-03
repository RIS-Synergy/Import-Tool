<template>
  <v-data-table-server
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :items-per-page="store.itemsPerPage"
    :loading="loading"
    :sort-by.sync="store.sortBy"
    @update:options="loadItems"
    @update:itemsPerPage="updateItemsPerPage"
  >
    <template v-slot:item.action="x">
      <NuxtLink :to="`/project/${x.item.id}`">
        <v-btn size="small" text="View" variant="flat"></v-btn>
      </NuxtLink>
    </template>
    <template v-slot:item.PI_email="x">
      <span v-html="email(x.item.PI_email)" />
    </template>
    <template v-if="false" #item="{ item }">
      <v-col cols="12">
        <v-card>
          <ProjectCard :data="item" />
        </v-card>
      </v-col>
    </template>
    <template v-if="false" #body="{ items, columns, toggleSelect }">
      <v-col cols="6" v-for="item in items">
        <v-card>
          <ProjectCard :data="item" />
        </v-card>
      </v-col>
    </template>
  </v-data-table-server>
</template>

<script setup>
const headers = [
  {
    title: "ID",
    align: "start",
    sortable: false,
    key: "id",
  },
  { title: "Title", key: "title", align: "start", sortable: false },
  { title: "PI Name", key: "PI_name", align: "start", sortable: false},
  { title: "PI Email", key: "PI_email", align: "start", sortable: false},
  { title: "Start Date", key: "startDate", align: "start", sortable: true},
  { title: "End Date", key: "endDate", align: "start", sortable: true},
  { title: "Status", key: "status", align: "start", sortable: true},
  { title: "Action", key: "action", align: "start", sortable: false},
  { title: "Pure ID", key: "pureId", align: "start", sortable: false},
];

const loading = ref(false);
const serverItems = ref([]);
const totalItems = ref(0);

const { getProjectsList } = useApiUtils()
async function loadItems({ page, itemsPerPage, sortBy }) {
  console.log('loadItems', page, itemsPerPage, sortBy)

  store.sortBy = sortBy;
  loading.value = true;

  // const response = await getProjectsList fetch("/api/fa/projects");
  // const { total, items } = await response.json();
  const { total, items } = await getProjectsList({ page, itemsPerPage, sortBy });

  serverItems.value = getItems(items);
  totalItems.value = total;
  loading.value = false;
}

function getLang(item, lang) {
  return item.find((x) => x.lang === lang).text;
}

function getItems(itms) {
  const result = itms.map((data) => {
    const x = data.risData;
    return {
      id: x.id,
      title: getLang(x.title, "en"),
      PI_email: x.team[0].person.electronicAddress,
      PI_name: x.team[0].person.personName.firstName + " " + x.team[0].person.personName.familyName,
      startDate: x.startDate,
      endDate: x.endDate,
      status: x.status,
      action: x,
      pureId: data.crisUUID,
    };
  });
  // console.log('getItems', result)
  return result;
}

function email(str) {
  // highlisht with bold, given the domain matches "univie.ac.at"
  if (!str) return str;

  const [name, domain] = str.split("@");
  return domain === "univie.ac.at" ? `<b>${name}</b>@${domain}` : str;
}

const page = ref(1);

const store = useUserSettingsStore();
function updateItemsPerPage(idx) {
  store.itemsPerPage = idx;
}
</script>

<style>
</style>
