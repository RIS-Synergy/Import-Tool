<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ props: activatorProps }">
      <!-- <div class="mt-1 text-warning" v-if="!templateSelected">
           Template not selected
           </div> -->
      <div class="diff">
        <v-btn
          v-if="false"
          v-bind="activatorProps"
          text="View"
          @click="isActive = true"
          variant="tonal"
        ></v-btn>
        <DiffText v-if="diffList" :data="diffList" @click="dialog = true" />
      </div>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-text>
          <DiffView :diff-list="diffList" :show-button="false" />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  diffList: {
    type: Array,
  },
});

const dialog = ref(false);
const isActive = ref(false);
</script>
