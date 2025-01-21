<template>
    <v-table v-if="hasAtLeastOne">
      <thead>
        <tr>
          <th>Template path</th>
          <th>RIS Data</th>
          <th>CRIS Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="diff in props.diffList" :key="diff.key">
          <td class="path mt-2">{{ diff.path }}</td>
          <td class="data">
            <Yaml v-if="diff.ris" :json="diff.ris" />
            <!-- <pre>
                 {{ diff.ris }}
                 </pre> -->
          </td>
          <td class="data">
            <Yaml v-if="diff.cris" :json="diff.cris" />
            <!-- <pre>
                 {{ diff.cris }}
                 </pre> -->
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
</style>

