<template>
  <v-container>
    <v-card v-for="f in data" class="mb-1">
      <v-card-title>{{f.name}}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :to="`functions/${f.name}`">View</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>

const { getFunction } = useApiUtils()
const data = await getFunction()

definePageMeta({
  // layout: "functions"
});
</script>
