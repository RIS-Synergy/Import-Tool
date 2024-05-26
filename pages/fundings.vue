<template>
  <v-data-table
    :items="getItems(items)"
    density="compact"
    items-per-page="100"
  >
    <template v-slot:item.id="{ item }">
      <NuxtLink :to="`/funding/${item.id}`">
        {{ item.id }}
      </NuxtLink>
    </template>

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
              <pre>
                {{ x.item.action }}
              </pre>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="primary"
                text="Upload to PURE"
                @click="uploadToPure(x.item.action)"
              ></v-btn>
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
const { data: items } = await useFetch('http://localhost:3000/fwf-test/fundings.json')

function getItems (itms) {
  return itms.map((x) => {
    return {
      action: x,
      type: x.type,
      id: x.id,
      legalType: x.legalType,
      partOf: x.partOf && x.partOf.id,
      fs: x.fundingScheme,
      name: x.name[0].text,
      duration: x.minProjectDuration && x.maxProjectDuration && `${x.minProjectDuration.years} - ${x.maxProjectDuration.years}`,
      programmeTracks: x.programmeTracks && x.programmeTracks[0].map((x) => x.text).join(', '),
      careerStages: x.careerStages && x.careerStages.join(', '),
      date: x.startDate && x.endDate && x.startDate.split('T')[0] + ' - ' + x.endDate.split('T')[0],
      acronym: x.acronym,
      running: x.running,
      amount: x.amount && x.amount.amount,
    }
  })
}

async function uploadToPure (item) {
  console.log('uploading to pure', item)
  // const x = await $fetch("/api/ri/upload", {
  //   method: 'POST',
  //   body: JSON.stringify(item)
  // });
  // console.log(x)
}

</script>
