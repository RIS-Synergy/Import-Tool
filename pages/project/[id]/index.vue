<template>
  <div>
    <ProjectView v-if="data" v-model="data" />
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
          <v-card title="RIS Project">
            <Yaml :json="data" @close="isActive.value = false" />
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
        :to="transformLink"
      >
        Transform
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script setup>
const store = useProjectStore();
const route = useRoute();
const routes = useRouter();
console.log("routes", routes);

const id = route.params.id;
const { data } = await useFetch(`/api/fa/projects/${id}`);

const transformLink = computed(() => {
  return { name: "project-id-transform", params: { id } };
});

</script>
