<template>
  <v-container>
    <v-row>
      <v-col cols="2" class="mt-4"> Project </v-col>
      <v-col cols="8">
        <TransformSelect
          templateType="project"
        />
      </v-col>
      <v-col cols="2" class="mt-2">
        <TransformDialog templateType="project" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="2" class="mt-4"> Application </v-col>
      <v-col cols="8">
        <TransformSelect
          templateType="application"
        />
      </v-col>
      <v-col cols="2" class="mt-2">
        <TransformDialog templateType="application" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="2" class="mt-4"> Award </v-col>
      <v-col cols="8">
        <TransformSelect
          templateType="award"
        />
      </v-col>
      <v-col cols="2" class="mt-2">
        <TransformDialog templateType="award" />
      </v-col>
    </v-row>
  </v-container>

  <div v-if="false">
    <v-card-text v-if="true">
      <TransformSelect />
      <TransformDiff
        v-if="result"
        :template="result.yamlTemplate"
        :result="result.transformationResult"
      />
    </v-card-text>
  </div>
</template>

<script setup>
const store = useProjectStore();
const route = useRoute();
const router = useRouter();
const { getProjectUUID } = useResearchInstitution();

const id = route.params.id;
const { data: ris } = await useFetch(`/api/fa/projects/${id}`);

// const transformations = ["Default", "Another Template"];
// const selectedTransformation = ref("Default");
//
const result = ref(null);

const titles = computed(() => {
  if (!data.value) return;
  return data.value.title.map((x) => x.text);
});

const { settings, templateId } = store;

const uuid = (await getProjectUUID(id)).uuid;

definePageMeta({
  layout: "project",
});
</script>
