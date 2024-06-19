<template>
  <v-card>
    <v-card-title v-if="false">
      {{ data.id }}
    </v-card-title>
    <div v-if="false" class="mx-5 my-2" v-for="title in titles">
      {{ title }}
    </div>
    <v-row dense>
      <v-col>
        <v-select
          class="ma-4"
          :items="transformations"
          label="Transformation"
          v-model="selectedTransformation"
          hide-details
        ></v-select>
      </v-col>
      <v-col>
        <v-btn class="ma-4" text="Transform" @click="loadTransformation" />

        <v-dialog max-width="1200">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps">
              View Input
            </v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <Yaml :json="data" @close="isActive.value = false" />
          </template>
        </v-dialog>

        <SaveOrEditButton class="ml-4" />
      </v-col>
    </v-row>
    <v-card-text v-if="result">
      <TransformDiff
        :template="result.yamlTemplate"
        :result="result.transformationResult"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
const store = useProjectStore();
const route = useRoute();
const id = route.params.id;
const { data } = await useFetch(`/api/fa/projects/${id}`);

const transformations = ["Default", "Another Template"];
const selectedTransformation = ref("Default");

const result = ref(null);

const titles = computed(() => {
  if (!data.value) return;
  return data.value.title.map((x) => x.text);
});

async function loadTransformation() {
  const x = await $fetch("/api/transform/upload", {
    method: "POST",
    body: JSON.stringify({
      ris: data.value,
      settings: {
        personUUID: "12345",
      },
    }),
  });
  result.value = x;
}

onMounted(() => {
  loadTransformation();
});

definePageMeta({
  // layout: "custom", // TODO pause for now
});
</script>
