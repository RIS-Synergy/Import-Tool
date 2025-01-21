<template>
  <v-container>
    <v-table v-if="hasAtLeastOne">
      <thead>
        <tr>
          <th>Template path</th>
          <th>RIS Data</th>
          <th>CRIS Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="diff in diffList" :key="diff.key">
          <td>{{ diff.path }}</td>
          <td>{{ diff.ris }}</td>
          <td><pre>
{{ diff.cris }}
</pre></td>
        </tr>
      </tbody>
    </v-table>
    <div v-else>
      <v-alert type="success" variant="outlined"
        >The CRIS Data is identical to the transformed template.</v-alert
      >
    </div>
  </v-container>
</template>

<script setup>
const store = useProjectStore();
const route = useRoute();

// const { loadProject } = useResearchInstitution();
const id = route.params.id;

const { getDiffs } = useApiUtils();
const diffList = ref([]);

onMounted(async () => {
  console.log("diff onMounted");

  diffList.value = await getDiffs(id);
});

const hasAtLeastOne = computed(() => {
  return diffList.value.length > 0;
});

definePageMeta({
  layout: "project",
});
</script>

<style scoped>
/* no idea why this is not 'bold' by default */
.v-table > .v-table__wrapper > table > thead > tr > th {
  font-weight: bold;
}
</style>
