<template>
  <div>
    <ProjectView v-if="data" v-model="data" />
    <v-card-actions class="my-3 mx-3">
      <v-spacer></v-spacer>
      <v-btn
        class="text-none"
        variant="flat"
        rounded
        width="12em"
        :disabled="!store.$state.personUUID"
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
const id = route.params.id;
const { data } = await useFetch(`/api/fa/projects/${id}`);
// const { type } = data.value;


async function uploadToPure (item) {
  const { personUUID } = store.$state;

  console.log('uploading to pure', item)
  console.log('personUUID', personUUID)
  const x = await $fetch("/api/ri/upload", {
    method: 'POST',
    body: JSON.stringify({
      ris: item,
      settings: {
        personUUID
      }
    })
  });
  console.log(x)
}
</script>
