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
  </v-data-table>
</template>

<script setup>
const { data: items } = await useFetch('http://localhost:3000/fwf-test/projects.json')

function getLang (item, lang) {
  return item.find((x) => x.lang === lang).text
}

async function uploadToPure (item) {
  console.log('uploading to pure', item)
  const x = await $fetch("/api/ri/upload", {
    method: 'POST',
    body: JSON.stringify(item)
  });
  console.log(x)
}

function getItems (itms) {
  return itms.map((x) => {
    return {
      id: x.id,
      title: getLang(x.title, 'en'),
      PI: x.team[0].person.electronicAddress,
      action: x
    }
  })
}

function linkToItem (id) {
  // to do: link to item: /projects/:id
}

const page = ref(1)
</script>
