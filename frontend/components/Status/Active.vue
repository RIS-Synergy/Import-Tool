<template>
  <v-dialog max-width="800">
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
              <span class="label"> UUID </span>
            </v-col>
            <v-col cols="10">
              {{ data.uuid }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <span class="label"> CRIS ID </span>
            </v-col>
            <v-col cols="10">
              {{ data.crisId }}
            </v-col>
          </v-row>
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
