<template>
  <v-data-table :items="getItems(items.items)">
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
              <PureProjectEdit :item="x.item.action" />
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                variant="tonal"
                color="primary"
                @click="save(x.item.action)">
                Save
              </v-btn>
              <v-btn text="Close" @click="isActive.value = false"></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </template>
  </v-data-table>
</template>

<script setup>
const { data: items } = await useFetch("/api/ri/search");

function getLang (item, lang) {
  return item.find((x) => x.lang === lang).text
}

async function save (item) {
  console.log('save/edit to pure', item)
  const x = await $fetch(`/api/ri/projects/${item.uuid}`, {
    method: 'PUT',
    body: JSON.stringify(item)
  });
  console.log(x)
}

function getItems (itms) {
  return itms.map((x) => {
    return {
      pureId: x.pureId,
      title: x.title.en_GB,
      awardDate: x.awardDate,
      funderReply: x.funderReply,
      submissionDate: x.submissionDate,
      systemName: x.systemName,

      action: x
    }
  })
}

</script>
