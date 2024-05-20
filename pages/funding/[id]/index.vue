<template>
  <FundingProgramme v-if="type === 'PROGRAMME'" v-model="data" />
  <FundingCall v-if="type === 'CALL'" v-model="data" />
  <div v-else>
    Error!
  </div>
</template>

<script setup>
const route = useRoute()
const id = route.params.id
const { data } = await useFetch(`/api/fa/fundings/${id}`);
const { type } = data.value;
</script>
