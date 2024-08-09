<template>
  <div>
    <PureProjectEdit :item="data" />
    <v-card-actions class="my-3 mx-3">
      <v-spacer></v-spacer>
      <v-btn
        class="text-none"
        variant="flat"
        rounded
        width="12em"
        color="primary"
      >
        TODO
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script setup>
const store = useProjectStore();
const route = useRoute();
const id = route.params.id;

// sample TODO
const uuid = 'dac59f08-371d-46f0-935e-592304d68148'

const { data } = useFetch(`/api/ri/projects/${uuid}`)

definePageMeta({
  layout: "project"
});
</script>
