<template>
  <div v-if="data.length">
    <v-card v-for="item in data" :key="item.uuid" class="mb-4">
      <v-card-text>
        <div class="vertical-right">
          <PureButton
            :pureId="item.pureId"
            :entityType="item.systemName.toLowerCase()"
          />
          <v-spacer />
          <DiffButton class="bottom"
                      :risId="risId"
                      :systemName="item.systemName"
                      :uuid="item.uuid"
                      :pureId="item.pureId" />
        </div>
        <div class="lower-right">
          <TransformButton
            v-if="
              isTransformPage &&
              entitySelected(item.systemName.toLowerCase()) &&
              item.uuid === store.templateSelect[item.systemName.toLowerCase()]
            "
            class="mt-2"
            :entityType="item.systemName.toLowerCase()"
            :uuid="item.uuid"
          />
        </div>
        <v-row v-if="!isTransformPage" dense>
          <v-col class="bold" cols="2">Entity</v-col>
          <v-col cols="7">{{ item.systemName }}</v-col>
          <v-col cols="3">
            <PureButton
              class="right mr-3"
              :pureId="item.pureId"
              :entityType="item.systemName.toLowerCase()"
          /></v-col>
        </v-row>
        <v-row dense>
          <v-col class="bold" cols="2">CRIS ID</v-col>
          <v-col cols="7">{{ item.pureId }}</v-col>
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
            <v-chip color="purple-darken-4">{{ risIdentifier(item) }}</v-chip>
          </v-col>
        </v-row>
        <v-row dense v-if="item.applicationCluster || item.awardCluster">
          <v-col class="bold" cols="2">Cluster</v-col>
          <v-col cols="10">
            <v-chip
              v-if="item.applicationCluster"
              size="small"
              class="mr-1"
              color="blue-darken-4"
            >
              Application
              <!-- {{ item.applicationCluster }} -->
            </v-chip>
            <v-chip v-if="item.awardCluster" size="small" color="blue-darken-4">
              Award
              <!-- {{ item.awardCluster }} -->
            </v-chip>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col class="bold" cols="2">Title</v-col>
          <v-col cols="10">
            <div v-for="(t, idx) in item.texts">
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
          <v-col class="bold" cols="2">Created Date</v-col>
          <v-col cols="10">{{ modDate(item.createdDate) }}</v-col>
        </v-row>
        <v-row dense>
          <v-col class="bold" cols="2">Modified Date</v-col>
          <v-col cols="10">{{ modDate(item.modifiedDate) }}</v-col>
        </v-row>
        <v-row v-if="isTransformPage" dense>
          <v-col class="bold" cols="2">Select</v-col>
          <v-col cols="10">
            <v-icon
              v-if="
                    store.templateSelect[item.systemName.toLowerCase()] &&
                    store.templateSelect[item.systemName.toLowerCase()] ===
                    item.uuid
                    "
              @click="store.selectTemplate(item.systemName.toLowerCase(), null)"
              icon="mdi-checkbox-marked-circle"
            />
            <v-icon
              v-else
              @click="
              store.selectTemplate(
                item.systemName.toLowerCase(),
                item.uuid,
                item,
              )
              "
              icon="mdi-checkbox-blank-circle-outline"
            />
          </v-col>
        </v-row>
        <PureClusterButton
          class="mt-2"
          v-if="isTransformPage && item.systemName === 'Application'"
          :item="item"
        />
        <PureClusterButton
          class="mt-2"
          v-if="isTransformPage && item.systemName === 'Award'"
          :item="item"
        />
      </v-card-text>
    </v-card>
  </div>
  <!-- {{ entityType }} -->
  <TransformButton
    class="mt-3"
    v-if="isTransformPage &&
           entitySelected(entityType) &&

           data.length === 0"
    :entityType="entityType"
    :uuid="null"
  />

  <!-- <Yaml :json="data" /> -->
</template>

<script setup>
import { formatDistance } from "date-fns";

const props = defineProps({
  data: Array[Object],
  entityType: String,
  risId: String,
});

function modDate(date) {
  return formatDistance(date, new Date(), { addSuffix: true });
}

function diffColor(val) {
  if (val === 1) {
    return "green";
  } else {
    return "orange";
  }
}

function risIdentifier(item) {
  const ris = "RIS ID";
  try {
    for (const t of item.identifiers) {
      const ris_id = t.type.term.en_GB;
      if (ris_id === ris) {
        return t.id;
      }
    }
  } catch (e) {
    return null;
  }
}

const router = useRouter();
// only one a page witth transform
const isTransformPage = computed(() => {
  const route = router.currentRoute.value;
  return route.name === "project-id-transform";
});

const store = useProjectStore();

function entitySelected(entity) {
  return !!store.template[entity + "Id"];
}

// function selectUUID (uuid) {
//   store.template[props.templateType + "Id"] = uuid
// }
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

.vertical-right {
  position: absolute;
  right: 1em;
}
.lower-right {
  position: absolute;
  right: 1em;
  bottom: 1em;
}

.bottom {
  background-color: #fee;
  height: 5em;
  /* position: absolute;
     bottom: 1em; */
}
</style>
