<template>
  <AppBar title="CRIS Search" />

  <v-container>
    <v-row align="center">
      <v-col cols="11">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          @keydown.enter="startSearch"
        >
        </v-text-field>
      </v-col>
      <v-col cols="1" class="mt-n4">
        <v-btn class="mt-3" icon @click="startSearch">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="modDate">Count: {{ result.length }}</div>
    <v-table v-if="result.length">
      <thead>
        <tr>
          <th>CRIS ID</th>
          <th>CRIS UUID</th>
          <th>Name or Title</th>
          <th>Entity</th>
          <th>Modified</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in result" key="item.uuid">
          <td>{{ item.pureId }}</td>
          <td>{{ item.uuid }}</td>
          <td>
            <span v-if="item.name">{{ item.name.firstName + " " }}</span>
            <span v-if="item.name">{{ item.name.lastName }}</span>
            <span v-if="item.title && item.title.en_GB"
              ><span class="grey">en</span> {{ item.title.en_GB }}</span
            >
            <span v-if="item.title && item.title.de_DE"
              ><br /><span class="grey">de</span> {{ item.title.de_DE }}</span
            >
          </td>
          <td>{{ item.systemName }}</td>
          <td class="modDate">{{ modDate(item.modifiedDate) }}</td>
          <td>
            <v-dialog max-width="1400">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  v-bind="activatorProps"
                  text="View"
                  variant="outlined"
                ></v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <PureUUID :uuid="item.uuid" :systemName="item.systemName" />
              </template>
            </v-dialog>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
const search = ref("");
const result = ref([]);

const { cris } = useApiUtils();
const { searchApi } = (await cris).default;

async function startSearch() {
  var rawResults = await searchApi(search.value);
  result.value = rawResults;
}

import { formatDistance } from "date-fns";

function modDate(date) {
  return formatDistance(date, new Date(), { addSuffix: true });
}
</script>

<style scoped>
/* italic and grey */
.modDate {
  font-style: italic;
  color: #666;
}

.grey {
  color: #999;
}
</style>
