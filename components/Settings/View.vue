<template>
  <v-container>
    <v-row no-gutters v-for="{ label, value } in storeObject">
      <v-col v-if="assign" sm="10">
        <v-text-field active variant="outlined" :label="label" :value="value" />
      </v-col>
      <v-col v-else sm="12">
        <v-text-field active variant="outlined" :label="label" :value="value" />
      </v-col>
      <v-col class="assign mt-2" v-if="assign" sm="2">
        <v-btn
          rounded
          text="assign" @click="assignData(label)" />
      </v-col>
      <v-col v-else sm="0" />
    </v-row>
  </v-container>
</template>

<script setup>
const store = useProjectStore();

const props = defineProps({
  assign: {
    type: Object,
  },
});

const storeObject = computed(() => {
  return Object.entries(store.settings).map(([key, value]) => {
    console.log(key, value);

    return {
      label: key,
      value: value,
    };
  });
});

function assignData (value) {
  store.settings[value] = props.assign.uuid;
}
</script>

<style scoped>
.assign {
  display: flex;
  justify-content: center;
}

</style>
