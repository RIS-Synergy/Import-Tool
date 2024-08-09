<template>
  <v-row no-gutters>
    <v-col class="label" sm="2">{{ label }}</v-col>
    <v-col sm="10">
      <component v-if="component" :is="comp" v-model="model" />
      <div v-else>
        {{ model }}
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
const model = defineModel()

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  component: {
    type: String,
    default: null
  }
});

const comp = props.component ? resolveComponent(props.component) : null

</script>

<style>
</style>
