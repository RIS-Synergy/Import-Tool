<template>
  <AppBar title="CRIS Systems" />

  <v-container>
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ props }">
        <v-fab
          color="primary"
          icon="mdi-plus"
          class="mb-4"
          location="bottom end"
          app
          @click="dialog = true"
        ></v-fab>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New CRIS System</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newCrisName"
                  label="Name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newCrisApiUrl"
                  label="API URL"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newCrisApiKey"
                  label="API Key (optional)"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="create">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
                  @click="select(item.id, item.name, item.apiUrl)"
                >
                  Select
                </v-btn>
                <v-btn v-else variant="outlined" @click="deselect()">
                  Deselect
                </v-btn>
              </v-col>
              <v-col class="text-right" v-if="item.id === currentCRIS">
                <v-btn variant="outlined" color="error" @click="deleteCris(item.id)">
                  Delete
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
import { computed, ref } from "vue";

const { cris, diff } = useApiUtils();
const { listAll, discoverExternalEntities, createApi, deleteApi } = (await cris).default;
const { diffSync } = (await diff).default;
const data = ref(await listAll());

const dialog = ref(false);
const newCrisName = ref("");
const newCrisApiUrl = ref("");
const newCrisApiKey = ref("");

const create = async () => {
  await createApi(newCrisName.value, newCrisApiUrl.value, newCrisApiKey.value);
  dialog.value = false;
  newCrisName.value = "";
  newCrisApiUrl.value = "";
  newCrisApiKey.value = "";
  data.value = await listAll();
};

const deleteCris = async (id: number) => {
  if (confirm("Are you sure you want to delete this CRIS system?")) {
    await deleteApi(id);
    data.value = await listAll();
    if (currentCRIS.value == id) {
      deselect();
    }
  }
};

const userSettingsStore = useUserSettingsStore();
const { setCRIS } = userSettingsStore;
const currentCRIS = computed(() => userSettingsStore.cris.id || null);

function select(itemId?: number, itemName: string, apiUrl: string) {
  setCRIS(itemId || null, itemName || null, apiUrl || null);
}

function deselect() {
  setCRIS(null as any, null as any, null as any);
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

