<template>
  <v-container>
    <v-btn color="primary" @click="downloadProject">
      Download All Projects</v-btn
    >
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "project-upload",
});

const files = ref([]);

const { apiCall } = useApiUtils();

async function downloadProject() {
  const data = await apiCall('project/download', "POST");

  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([ jsonData ], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Projects_${date}.json`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
}
</script>
