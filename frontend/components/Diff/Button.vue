<template>
  <v-dialog max-width="1800">
    <template v-slot:activator="{ props: activatorProps }">
      <div class="diff mt-1">
      <v-btn
        v-if="false"
        v-bind="activatorProps"
        text="View"
        @click="onClickView"
        variant="tonal"
      ></v-btn>
      Diff... (TODO)
      </div>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-text>
          <DiffView />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>

  <!-- <div>
       {{data}}
       </div> -->
  <!-- <v-btn
       variant="flat" color="grey" rounded
       >
       Diff btn
       </v-btn> -->
</template>

<script setup>
const props = defineProps({
  pureId: {
    type: String,
    required: true,
  },
});

const isActive = ref(true);

const data = ref(null)

onMounted(() => {
  console.log('mounted')
  data.value = 'data'
})
</script>

<style scoped>
.diff {
  background-color: lightgrey;
  padding: 10px;
}
</style>
