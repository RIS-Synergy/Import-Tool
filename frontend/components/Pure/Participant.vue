<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const item = props.item;

const { data: person } = await useFetch(`/api/ri/persons/${item.person.uuid}`);
</script>

<template>
{{ person.name.firstName }} {{ person.name.lastName }}
</template>

<style>
</style>
