<template>
  <v-container>
    <v-card v-for="f in data" class="mb-1">
      <v-card-title>{{f.name}}</v-card-title>
      <v-card-text v-if="false">
        <pre>
          {{f.code}}
        </pre>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :to="`functions/${f.id}`">View</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>

const { getAllFunctions } = useApiUtils()
const data = await getAllFunctions()
</script>
