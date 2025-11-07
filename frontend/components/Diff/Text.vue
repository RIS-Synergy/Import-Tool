<template>
  <div class="mt-3">
    <span v-if="!Array.isArray(data)"> Not an Array </span>
    <v-btn
      v-if="countRIS.length === 0"
      rounded
      variant="outlined"
      color="green"
      @click="click"
      ><v-icon>mdi-set-right</v-icon>No diff</v-btn
    >
    <v-btn v-else rounded variant="outlined" color="orange" @click="click"
      ><v-icon>mdi-set-right</v-icon>{{ countRIS.length }} diffs</v-btn
    >
  </div>
</template>

<script setup>
const emit = defineEmits(["click"]);
const props = defineProps({
  data: Object,
  // activatorProps: Object,
});

const value = props.data;

const countCRIS = value
  .map((v) => {
    if (v.a) {
      return v.path;
    }
  })
  .filter((v) => v);

const countRIS = value
  .map((v) => {
    if (v.b) {
      return v.path;
    }
  })
  .filter((v) => v);

function click() {
  emit("click");
}
</script>
