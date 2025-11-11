<template>
  <AppBar title="CRIS Systems" />

  <v-table density="compact">
    <thead>
      <tr>
        <th>Name</th>
        <th>API</th>
        <th>Research Institution</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.id">
        <td>
          <span :class="{ 'font-weight-bold': item.id === currentCRIS }">
            {{ item.name }}
          </span>
        </td>
        <td>{{ item.apiUrl }}</td>
        <td>{{ item.researchInstitution.name }}</td>
        <td>
          <v-btn
            v-if="item.id !== currentCRIS"
            variant="outlined"
            size="small"
            @click="select(item.id, item.name)"
          >
            select
          </v-btn>
          <v-btn
            v-else
            variant="outlined"
            size="small"
            @click="deselect()"
          >
            deselect
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { computed } from "vue";

const { cris } = useApiUtils();
const { listAll } = (await cris).default;
const data = await listAll();

const userSettingsStore = useUserSettingsStore();
const { setCRIS } = userSettingsStore;
const currentCRIS = computed(() => userSettingsStore.cris.id || null);

function select (itemId?: number, itemName: string) {
  setCRIS(itemId || null, itemName || null)
}

function deselect () {
  setCRIS(null, null)
}
</script>
