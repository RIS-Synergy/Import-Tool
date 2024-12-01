<template>
  <v-dialog max-width="800">
    <template v-slot:activator="{ props: activatorProps }">
      <v-chip class="text-none" v-bind="activatorProps" color="#ff60aa">
        likely
      </v-chip>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="CRIS Status">
        <v-card-text>
          <Yaml :json="data" />
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  data: Array[Object],
});
</script>
