<template>
  <v-btn
    class="float-right mr-5 toggleBtn"

    variant="outlined"
    @click="store.toggleDiff()">
    <span v-if="store.diff.onlyRIS"> Only RIS Data </span>
    <span v-else> All Diffs </span>
  </v-btn>
  <v-table v-if="hasAtLeastOne">
    <thead>
      <tr>
        <th>Template path</th>
        <th>RIS Data</th>
        <th>CRIS Data</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(diff, idx) in tableList" :key="idx">
        <td class="path mt-2">{{ diff.path }}</td>
        <td class="data">
          <!-- if RIS is a string -->
          <span class="string" v-if="typeof diff.ris === 'string'">{{ diff.ris }}</span>
          <!-- if it's a number -->
          <span class="number" v-else-if="typeof diff.ris === 'number'">{{ diff.ris }}</span>
          <!-- if it's undefined -->
          <span v-else-if="diff.ris === undefined"></span>
          <Yaml v-else="diff.ris" :json="diff.ris" />
        </td>
        <td class="data">
          <!-- if CRIS is a string -->
          <span class="string" v-if="typeof diff.cris === 'string'">{{ diff.cris }}</span>
          <!-- if it's a number -->
          <span class="number" v-else-if="typeof diff.cris === 'number'">{{ diff.cris }}</span>
          <!-- if it's undefined -->
          <span v-else-if="diff.cris === undefined"></span>
          <Yaml v-else="diff.cris" :json="diff.cris" />
        </td>
      </tr>
    </tbody>
  </v-table>
  <div v-else>
    <v-alert type="success" variant="outlined"
      >The CRIS Data is identical to the transformed template.</v-alert
    >
  </div>
</template>

<script setup>
const store = useProjectStore();
const props = defineProps({
  diffList: {
    type: Array,
    required: true,
  },
});

const hasAtLeastOne = computed(() => {
  return props.diffList.length > 0;
});

const tableList = computed(() => {
  return props.diffList.filter(validate);
});

function validate (diff) {
  if (store.diff.onlyRIS) {
    return diff && !!diff.ris
  }
  return true
}
</script>

<style scoped>
/* no idea why this is not 'bold' by default */
.v-table > .v-table__wrapper > table > thead > tr > th {
  font-weight: bold;
}

.path {
  max-width: 10em;
}

.data {
  max-width: 20em;
}

.toggleBtn {
  position: absolute;
  right: 0;
}

.number {
  /* font-style: italic; */
  opacity: 0.8;
  /* bluer */
  color: #26c;
  font-size: 1.1em;
}

.string {
  /* slightly larger */
  font-size: 1.1em;
}
</style>
