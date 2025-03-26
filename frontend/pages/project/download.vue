<template>
  <v-container>
    Download all Projects in <b>JSON</b> format:
    <div class="mb-5">
      <v-btn color="primary" @click="download('JSON')"> Download</v-btn>
    </div>
    Download all Projects in <b>Excel</b> format:

    <div>
      <v-btn color="primary" @click="download('Excel')"> Download</v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "project-upload",
});

const files = ref([]);
const { apiCall } = useApiUtils();

function fileName(format) {
  if (format === "JSON") {
    return `Projects_${new Date().toISOString().slice(0, 10)}.json`;
  } else {
    return `Projects_${new Date().toISOString().slice(0, 10)}.xlsx`;
  }
}

const download = async (format) => {
  var blob = await apiCall("project/download", "POST", {
    body: {
      format,
    },
  });

  // not a Excel, but a JSON
  if (Array.isArray(blob)) {
    const data = JSON.stringify(blob);
    blob = new Blob([data], { type: "application/json" });
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName(format);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
