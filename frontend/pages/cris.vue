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
          </v-card-text>
          <v-card-actions>
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
            <v-spacer />
            <v-btn variant="outlined" @click="discover(item.id)">
              Discover
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";

const { cris } = useApiUtils();
const { listAll, discoverExternalEntities } = (await cris).default;
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
