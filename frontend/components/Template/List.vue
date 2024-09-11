<template>
  template list, type {{ props.templateType }}

  <v-list>
    <v-list-item>
      <v-btn :to="`${templateType}/1`">
        1
      </v-btn>
    </v-list-item>
  </v-list>
</template>

<script setup>
const props = defineProps({
  templateType: String
})

const route = useRoute()
console.log('templateType', props.templateType, 'on route', route.fullPath)
</script>
