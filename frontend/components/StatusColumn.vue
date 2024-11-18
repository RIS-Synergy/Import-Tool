<template>
  <v-dialog v-if="data.uuid" max-width="800">
    <template v-slot:activator="{ props: activatorProps }">
      <v-chip class="text-none" v-bind="activatorProps" color="light-green">
        active
      </v-chip>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="CRIS Status">
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <span class="label">
                UUID
              </span>
            </v-col>
            <v-col cols="10">
              {{ data.uuid }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">

              <span class="label">
              CRIS ID
              </span>
            </v-col>
            <v-col cols="10">
              {{ data.crisId }}
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>

  <span v-else>
    <v-chip class="text-none" v-bind="activatorProps" color="#ffaa60">
      new
    </v-chip>
  </span>
</template>

<script setup>
const props = defineProps({
  data: Object,
});
</script>

<style scoped>
.label {
  font-weight: bold;
}
</style>
