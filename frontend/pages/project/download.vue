<template>
  <v-container>
    <!-- RI filter -->
    <v-col cols="6">
      <v-card
        title="Filter by Research Institution">
        <v-card-text>
          <v-select
            v-model="ror"
            :items="rorItems"
          ></v-select>
        </v-card-text>
      </v-card>
    </v-col>

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
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "project-upload",
});

// duplicated in FilterButton component
const rorItems = [
  {
    value: "https://ror.org/03prydq77",
    title: "Universität Wien",
  },
  {
    value: "https://ror.org/05gs8cd61",
    title: "Universität Salzburg",
  },
  {
    value: "https://ror.org/029djt864",
    title: "Akademie der bildenden Künste",
  },
];

const ror = ref(null);

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
      ror: ror.value,
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
