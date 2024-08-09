<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const item = props.item;

const { data: organization } = await useFetch(`/api/ri/organizations/${item.uuid}`);

</script>

<template>
  {{ organization.name.en_GB }}
</template>

<style>
/* copy in a scss style global file */
.text {
  color: #999;
}
</style>
