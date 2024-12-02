<template>
  <div v-if="data.length">
    <v-card v-for="item in data" :key="item.uuid" class="mb-4">
      <v-card-text>
        <v-row dense>
          <v-col class="bold" cols="2">pureId</v-col>
          <v-col cols="10">{{ item.pureId }}</v-col>
        </v-row>
        <v-row dense>
          <v-col class="bold" cols="2">uuid</v-col>
          <v-col cols="10">{{ item.uuid }}</v-col>
        </v-row>
        <v-row v-if="false">
          <v-col class="bold" cols="2">risText</v-col>
          <v-col cols="10">{{ item.risText }}</v-col>
        </v-row>
        <v-row v-if="false">
          <v-col class="bold" cols="2">texts</v-col>
          <v-col cols="10">
            <pre>
            {{ item.texts }}
            </pre>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col class="bold" cols="2">systemName</v-col>
          <v-col cols="10">{{ item.systemName }}</v-col>
        </v-row>
        <!-- <Yaml :json="item" /> -->
      </v-card-text>
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
