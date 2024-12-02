<template>
  <div v-if="data.length">
    <v-card v-for="item in data" :key="item.uuid" class="mb-4">
      <v-card-title>
        <b>{{ item.pureId }}</b
        ><br />
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="bold" cols="2">entity</v-col>
          <v-col cols="10">{{ item.entity }}</v-col>
        </v-row>
        <Yaml :json="item" />
      </v-card-text>
      <v-card-actions>
        <v-dialog max-width="1400">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              text="View"
              variant="outlined"
            ></v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <div v-for="x in item.results">
              <PureUUID :uuid="x.uuid" :entity="x.entity" />
            </div>
          </template>
        </v-dialog>
      </v-card-actions>
    </v-card>
  </div>
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

.bold {
  font-weight: 900;
}
</style>
