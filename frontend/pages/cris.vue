<template>
  <AppBar title="CRIS Systems" />

  <v-container>
    <v-row>
      <v-col v-for="item in data" :key="item.id" cols="12" md="6">
        <v-card
          :class="{ 'border-primary': item.id === currentCRIS }"
          :style="{
            'background-color': item.id === currentCRIS ? '#e3f2fd' : 'white',
          }"
        >
          <v-card-title>
            <span :class="{ 'font-weight-bold': item.id === currentCRIS }">
              {{ item.name }}
            </span>
          </v-card-title>
          <v-card-text>
            <div><strong>API:</strong> {{ item.apiUrl }}</div>
            <div>
              <strong>Research Institution:</strong>
              {{ item.researchInstitution.name }}
            </div>

            <v-row class="mt-0">
              <v-col cols="4">
                <v-btn
                  v-if="item.id !== currentCRIS"
                  variant="outlined"
                  @click="select(item.id, item.name)"
                >
                  Select
                </v-btn>
                <v-btn v-else variant="outlined" @click="deselect()">
                  Deselect
                </v-btn>
              </v-col>
            </v-row>

            <hr v-if="item.id === currentCRIS" class="mt-3" />

            <v-row v-if="item.id === currentCRIS" class="mt-0">
              <v-col cols="4">
                <v-btn variant="tonal" @click="discover(item.id)">
                  <v-icon class="mr-1">mdi-search-web</v-icon>
                  Discover
                </v-btn>
              </v-col>
              <v-col class="info-text">
                Search for potential external entities in this CRIS (by the <b>title</b> of a Project).
              </v-col>
            </v-row>

            <hr v-if="item.id === currentCRIS" class="mt-3" />

            <v-row v-if="item.id === currentCRIS" class="mt-0">
              <v-col cols="4">
                <v-btn variant="tonal" @click="diffSync(item.id)">
                  <v-icon class="mr-1">mdi-set-right</v-icon>
                  Diff Sync
                </v-btn>
              </v-col>
              <v-col class="info-text">
                Search for differences between a given template and the corresponding external entity in this CRIS.
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";

const { cris, diff } = useApiUtils();
const { listAll, discoverExternalEntities } = (await cris).default;
const { diffSync } = (await diff).default;
const data = await listAll();

const userSettingsStore = useUserSettingsStore();
const { setCRIS } = userSettingsStore;
const currentCRIS = computed(() => userSettingsStore.cris.id || null);

function select(itemId?: number, itemName: string) {
  setCRIS(itemId || null, itemName || null);
}

function deselect() {
  setCRIS(null, null);
}

function discover(itemId) {
  discoverExternalEntities(itemId);
}
</script>

<style scoped>
.info-text {
  opacity: 0.6;
  font-size: 0.9em;
}
</style>

