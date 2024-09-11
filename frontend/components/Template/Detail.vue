<template>
  template detail
</template>

<script setup>
const props = defineProps({
  // templateType: String
})

const route = useRoute()
console.log(route)

// console.log('templateType', props.templateType, 'on route', route.fullPath)
</script>
