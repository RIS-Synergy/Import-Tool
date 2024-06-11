<template>
  <v-card>
    <v-card-title>
      {{ data.id }}
    </v-card-title>
    <div class="mx-5 my-2" v-for="title in titles">
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
      </v-col>
    </v-row>
    <v-card-text v-if="result">
      <Yaml :json="result" />
    </v-card-text>
  </v-card>
</template>

<script setup>
const store = useProjectStore();
const route = useRoute();
const id = route.params.id;
const { data } = await useFetch(`/api/fa/projects/${id}`);

const transformations = ["Default", "Foo", "Bar", "Fizz", "Buzz"];
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
  layout: "custom",
});
</script>
