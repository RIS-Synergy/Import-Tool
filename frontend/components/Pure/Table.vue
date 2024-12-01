<template>
  <v-table v-if="data.length">
    <thead>
      <tr>
        <th>CRIS ID, UUID</th>
        <th>Name or Title</th>
        <th>Entity</th>
        <th>Modified</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" key="item.uuid">
        <td>
          <b>{{ item.pureId }}</b
          ><br />
          {{ item.uuid }}
        </td>
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
        <td>{{ item.entity || item.systemName }}</td>
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
              <PureUUID
                :uuid="item.uuid"
                :entity="item.entity"
                :underItem="true"
              />
            </template>
          </v-dialog>
        </td>
      </tr>
    </tbody>
  </v-table>
  <!-- <Yaml :json="data" /> -->
</template>

<script setup>
const props = defineProps({
  data: Array[Object],
});

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
