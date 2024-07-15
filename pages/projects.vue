<template>
  <v-data-table
    :items="getItems(items)"
    density="compact"
    items-per-page="25"
  >
    <template v-slot:item.action="x">
      <NuxtLink :to="`/project/${x.item.id}`">
        <v-btn
          size="small"
          text="View"
          variant="flat"
        ></v-btn>
      </NuxtLink>
    </template>

    <template v-slot:item.PI="x">
      <span v-html="email(x.item.PI)" />
    </template>

  </v-data-table>
</template>

<script setup>
// taking the project locally TODO
// const { data: items } = await useFetch('http://localhost:3000/fwf-test/projects.json')
const { data: items } = await useFetch('/api/fa/projects')

function getLang (item, lang) {
  return item.find((x) => x.lang === lang).text
}

function getItems (itms) {
  return itms.map((data) => {
    const x = data.risData
    return {
      id: x.id,
      title: getLang(x.title, 'en'),
      PI: x.team[0].person.electronicAddress,
      start_date: x.startDate,
      end_date: x.endDate,
      status: x.status,
      action: x,
      pureId: data.crisId
    }
  })
}

function linkToItem (id) {
  // to do: link to item: /projects/:id
}

function email (str) {
  // highlisht with bold, given the domain matches "univie.ac.at"
  if(!str) return str

  const [name, domain] = str.split('@')
  return domain === 'univie.ac.at' ? `<b>${name}</b>@${domain}` : str
}

const page = ref(1)

// set store settings to {}
const { resetSettings } = useProjectStore();

// when entering the page, reset the settings
onMounted(() => {
  resetSettings()
})
</script>
