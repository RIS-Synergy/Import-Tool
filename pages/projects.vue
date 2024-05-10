<template>
  <v-data-table
    :items="getItems(items)"
    density="compact"
    items-per-page="25"
  >
    <template v-slot:item.action="x">
      <v-dialog>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            size="small"
            v-bind="activatorProps"
            text="View"
            variant="flat"
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card :title="x.item.id">
            <v-card-text>
              <ProjectView :item="x.item.action" />
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text="Close"
                @click="isActive.value = false"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </template>
  </v-data-table>
</template>

<script setup>
const { data: items } = await useFetch('http://localhost:3000/fwf-test/projects.json')

function getLang (item, lang) {
  return item.find((x) => x.lang === lang).text
}

function getItems (itms) {
  return itms.map((x) => {
    return {
      id: x.id,
      title: getLang(x.title, 'en'),
      action: x
    }
  })
}

const page = ref(1)
</script>
