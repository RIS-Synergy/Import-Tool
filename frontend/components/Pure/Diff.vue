<template>
  <v-card v-if="templateId" color="text-orange">
    <v-alert v-if="hasAtLeastOne" type="warning" variant="outlined"
      >The CRIS Data is different to the latest transformed template.</v-alert
    >
    <div v-else>
      <v-alert type="success" variant="outlined"
        >The CRIS Data is identical to the latest transformed template.</v-alert
      >
    </div>
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
          <td>{{ diff.cris }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup>
const props = defineProps({
  templateId: {
    type: Number,
    required: true,
  },
});

const store = useProjectStore();
const route = useRoute();

const { getDiffs } = useApiUtils();
const diffList = ref([]);

const hasAtLeastOne = computed(() => {
  return diffList.value.length > 0;
});

onMounted(async () => {
  console.log("diff onMounted");
  diffList.value = await getDiffs(
    route.params.id,
    props.templateId
  );
});
</script>

<style scoped>
/* no idea why this is not 'bold' by default */
.v-table > .v-table__wrapper > table > thead > tr > th {
  font-weight: bold;
}
</style>
