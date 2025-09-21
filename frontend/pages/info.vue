<template>
  <AppBar title="Info" />
  <Yaml :json="data" />
</template>

<script setup>
// const { data: items } = await useFetch("http://localhost:3000/fwf-test/info.json");
// const { data: items } = await useFetch("/api/fa/info");
const { faApi } = useApiUtils();
const data = await faApi("info");
</script>
