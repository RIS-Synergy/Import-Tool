<template>
  <v-dialog max-width="800">
    <template v-slot:activator="{ props: activatorProps }">
      <v-chip class="text-none" v-bind="activatorProps" color="#ff60aa">
        likely <span class="ml-1 number">{{data.length}}</span>
      </v-chip>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-text>
          <PureTable :data="data" />
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

<style scoped>
.number {
  font-weight: bold;
}
</style>
