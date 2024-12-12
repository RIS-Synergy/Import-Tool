<template>
  <div v-if="data.length">
    <v-card v-for="item in data" :key="item.uuid" class="mb-4">
      <v-card-text>
        <v-row dense>
          <v-col class="bold" cols="2">CRIS ID</v-col>
          <v-col cols="7">{{ item.pureId }}</v-col>
          <v-col cols="3">
            <PureButton
              class="right mr-3"
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
        <v-row v-if="risIdentifier(item)" dense>
          <v-col style="margin: auto" class="bold" cols="2">RIS ID</v-col>
          <v-col cols="10">
            <v-chip
              color="purple-darken-4"
            >{{risIdentifier(item)}}</v-chip>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col class="bold" cols="2">Title</v-col>
          <v-col cols="10">
            <div v-for="t, idx in item.texts">
              <v-chip size="small" color="blue">{{ t.lang }}</v-chip>
              <v-chip class="ml-1" :color="diffColor(t.diff)" size="small">{{
                // percent
                100 * t.diff.toFixed(2).toString() + "%"
              }}</v-chip
              ><br />
              <!-- last title text lower padding (margin down, md) -->
              <div v-if="idx !== item.texts.length - 1" class="mb-1 pb-1">
                {{ t.crisText }}
              </div>
              <div v-else class="pb-1">
                {{ t.crisText }}
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col class="bold" cols="2">Entity</v-col>
          <v-col cols="10">{{ item.systemName }}</v-col>
        </v-row>
        <v-row dense>
          <v-col class="bold" cols="2">Created Date</v-col>
          <v-col cols="10">{{ modDate(item.createdDate) }}</v-col>
        </v-row>
        <v-row dense>
          <v-col class="bold" cols="2">Modified Date</v-col>
          <v-col cols="10">{{ modDate(item.modifiedDate) }}</v-col>
        </v-row>
        <!-- <Yaml :json="item" /> -->
        <TransformButton
          v-if="isTransformPage && entitySelected(item.systemName.toLowerCase())"
          class="mt-2"
          :entityType="item.systemName.toLowerCase()"
          :uuid="item.uuid"
        />
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

function diffColor (val) {
  if (val === 1) {
    return 'green'
  } else {
    return 'orange'
  }
}

function risIdentifier (item) {
  const ris = 'RIS ID'
  try {
    for (const t of item.identifiers) {
      const ris_id = t.type.term.en_GB
      if (ris_id === ris) {
        return t.id
      }
    }
  } catch (e) {
    return null
  }
}

const router = useRouter();
// only one a page witth transform
const isTransformPage = computed(() => {
  const route = router.currentRoute.value;
  return route.name === "project-id-transform"
})

const store = useProjectStore();

function entitySelected (entity) {
  return !!store.template[entity + "Id"]
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
  position: absolute;
  right: 0;
}
</style>
