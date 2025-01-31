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
          <Yaml v-if="diff.ris" :json="diff.ris" />
        </td>
        <td class="data">
          <Yaml v-if="diff.cris" :json="diff.cris" />
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
  console.log(diff)
  if (store.diff.onlyRIS) {
    // console.log(diff)
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
</style>
