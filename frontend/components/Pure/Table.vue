<template>
  <div v-if="data.length">
    <v-card v-for="item in data" :key="item.uuid" class="mb-4">
      <v-card-text>
        <v-row dense>
          <v-col class="bold" cols="2">CRIS ID</v-col>
          <v-col cols="7">{{ item.pureId }}</v-col>
          <v-col cols="3">
            <PureButton
              class="right mr-2"
              :pureId="item.pureId"
              :entityType="item.systemName.toLowerCase()"
          /></v-col>
        </v-row>
        <v-row dense>
          <v-col class="bold" cols="2">CRIS UUID</v-col>
          <v-col cols="10">{{ item.uuid }}</v-col>
        </v-row>
        <v-row v-if="false">
          <v-col class="bold" cols="2">risText</v-col>
          <v-col cols="10">{{ item.risText }}</v-col>
        </v-row>
        <v-row dense>
          <v-col class="bold" cols="2">Title</v-col>
          <v-col cols="10">
            <div v-for="t in item.texts">
              <span class="grey">{{t.lang}}</span>
              <span class="ml-2">{{t.diff}}</span><br/>
              {{t.crisText}}
            </div>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col class="bold" cols="2">Entity</v-col>
          <v-col cols="10">{{ item.systemName }}</v-col>
        </v-row>
        <v-row dense>
          <v-col class="bold" cols="2">Modified Date</v-col>
          <v-col cols="10">{{ modDate(item.modifiedDate) }}</v-col>
        </v-row>
        <!-- <Yaml :json="item" /> -->
      </v-card-text>
    </v-card>
  </div>
  <!-- <Yaml :json="data" /> -->
</template>

<script setup>
import { formatDistance } from "date-fns";

const props = defineProps({
  data: Array[Object],
});

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
.right {
  float: right;
  /* absolute */
  position: absolute;
  right: 0;
}
</style>
