<template>
  <v-container>
    <v-file-input
      v-model="files"
      label="RIS project files"
      variant="solo"
      accept=".json"
      chips
      multiple
    ></v-file-input>

    <v-btn :disabled="!files.length" color="primary" @click="uploadProject">
      Upload projects
    </v-btn>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "project-upload",
});

const files = ref([]);

function uploadProject() {
  const formData = new FormData();
  files.value.forEach((file) => {
    formData.append("files", file);
  });

  fetch("/api/project/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}
</script>
