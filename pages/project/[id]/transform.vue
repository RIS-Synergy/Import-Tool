<template>
  <v-card>
    <v-card-title>
      {{ data.id }}
    </v-card-title>
    <div v-for="title in titles">
        {{ title }}
      </div>
      <v-select
        :items="transformations"
        label="Transformation"
        v-model="selectedTransformation"
      ></v-select>
    <v-card-text>
    </v-card-text>
    <v-btn text="Transform" @click="loadTransformation" />
    <v-card-text v-if="result">
      <Yaml :json="result" />
    </v-card-text>
    <v-card-actions>
      foo
    </v-card-actions>
  </v-card>
</template>

<script setup>
const store = useProjectStore();
const route = useRoute();
const id = route.params.id;
const { data } = await useFetch(`/api/fa/projects/${id}`);

const transformations = ['Foo', 'Bar', 'Fizz', 'Buzz']
const selectedTransformation = ref('Foo')

const result = ref(null)

const titles = computed(() => {
  if(!data.value) return
  return data.value.title.map(x => x.text)
})

async function loadTransformation () {
  const x = await $fetch("/api/transform/upload", {
    method: "POST",
    body: JSON.stringify({
      ris: data.value,
      settings: {
        personUUID: '12345',
      },
    }),
  });
  result.value = x
}

onMounted(() => {
  loadTransformation()
})
</script>
