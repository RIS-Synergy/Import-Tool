<template>
  <v-container>
    <v-card>
      <v-card-title v-if="false">{{f.name}}</v-card-title>
      <v-card-text>
        <FuncitonCodeEditor :data="f.code" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "functions"
});

const route = useRoute()

const { functions } = useApiUtils();
const { getFunction } = (await functions).default;

const f = await getFunction(route.params.id)
</script>
