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
          <Yaml :json="data" @close="isActive.value = false" />
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

      <v-btn
        class="text-none"
        variant="flat"
        rounded
        width="12em"
        :disabled="!store.$state.settings.personUUID"
        color="primary"
        @click="uploadToPure(data)"
      >
        Upload to PURE
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

async function uploadToPure(item) {
  const { personUUID } = store.$state;

  console.log("uploading to pure", item);
  console.log("personUUID", personUUID);
  const x = await $fetch("/api/ri/upload", {
    method: "POST",
    body: JSON.stringify({
      input: data.value,
      ris: item,
      settings: {
        personUUID,
      },
    }),
  });
  console.log(x);
}
</script>
