<template>
  <v-dialog max-width="800">
    <template v-slot:activator="{ props: activatorProps }">
      <v-chip class="text-none" v-bind="activatorProps" :color="color">
        {{ text }} <span class="ml-1 number">{{data.length}}</span>
      </v-chip>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-text>
          <PureTable :risId="risId" :data="data" />
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  data: Array[Object],
  risId: String,
  uuid: String,
  same: {
    type: Boolean,
    default: false,
  }
});

const text = ref('Unknown');
const color = ref('orange');

if (props.data.length) {
  text.value = 'Likely';
  color.value = 'pink';
}
if (props.uuid) {
  text.value = 'RIS';
  color.value = 'purple';
}

watch(() => props.same, (val) => {
  if (val) {
    text.value = 'Identical';
    color.value = 'green';
  }
});
</script>

<style scoped>
.number {
  font-weight: bold;
}
</style>
