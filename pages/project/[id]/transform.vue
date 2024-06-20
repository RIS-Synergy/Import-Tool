<template>

  <v-card>
    <v-card-title v-if="false">
      {{ data.id }}
    </v-card-title>
    <div v-if="false" class="mx-5 my-2" v-for="title in titles">
      {{ title }}
    </div>
    <v-row class="ml-2 mt-2">
      <div>Settings</div>
      <pre>{{ store.settings }}</pre>
    </v-row>
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
            <Yaml :json="ris" @close="isActive.value = false" />
          </template>
        </v-dialog>

        <v-btn v-if="uuid" class="ma-4" text="Save" @click="save()" />
        <v-btn v-else class="ma-4" text="Create" @click="save()" />

        <div>
          {{ uuid }}
        </div>
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
const { getProjectUUID, uploadToPure } = useResearchInstitution();

const id = route.params.id;
const { data: ris } = await useFetch(`/api/fa/projects/${id}`);

const transformations = ["Default", "Another Template"];
const selectedTransformation = ref("Default");

const result = ref(null);

const titles = computed(() => {
  if (!data.value) return;
  return data.value.title.map((x) => x.text);
});

const { settings } = store;

async function loadTransformation() {
  const x = await $fetch("/api/transform/upload", {
    method: "POST",
    body: JSON.stringify({
      ris: ris.value,
      settings
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

const uuid = (await getProjectUUID(id)).uuid;

async function save (crud) { // create or edit
  const result = await uploadToPure(ris.value, settings, uuid)
  console.log("result", result)
  // TODO redirect?
}

</script>
