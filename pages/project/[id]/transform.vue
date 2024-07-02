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
    <v-row class="ml-2 mt-2">
      <div>UUID: </div>
      <div>
        {{ uuid }}
      </div>
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
      </v-col>
    </v-row>
    <v-card-text v-if="result">
      <TransformDiff
        :template="result.yamlTemplate"
        :result="result.transformationResult"
      />
    </v-card-text>
    <v-card-actions class="my-3 mx-3">
      <v-dialog max-width="1200">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            class="text-none"
            variant="flat"
            rounded
            width="12em"
            v-bind="activatorProps"
            color="grey"
          >
            View Data
          </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card>
            <Yaml :json="ris" @close="isActive.value = false" />
          </v-card>
        </template>
      </v-dialog>

      <v-spacer></v-spacer>
      <v-btn
        class="text-none"
        variant="flat"
        rounded
        width="12em"
        color="primary"
        @click="save"
      >
        <span v-if="uuid">Update Project</span>
        <span v-else>Create new Project</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const store = useProjectStore();
const route = useRoute();
const router = useRouter();
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
      settings,
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

async function save(crud) {
  // create or edit
  const result = await uploadToPure(ris.value, settings, uuid);
  store.setPure(result);

  // redirect to project view
  router.push({ name: "project-id-view", params: { id: route.params.id } });
}
</script>
