<template>
  <v-container>
    <v-card>
      <v-card-title>{{f.name}}</v-card-title>
      <v-card-text>
        <pre>
          {{f.code}}
        </pre>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "functions"
});

const { getFunction } = useApiUtils()
const route = useRoute()

const f = await getFunction(route.params.id)
</script>
