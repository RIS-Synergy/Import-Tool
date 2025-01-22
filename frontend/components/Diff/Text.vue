<template>
  <span v-if="!Array.isArray(data)">
    Not an Array
  </span>
  <!-- === 0 -->
  <span v-if="data.length === 0">
    No diffs
  </span>
  <span v-else>
    {{btnText()}}
  </span>
</template>

<script setup>
const props = defineProps({
  data: Object,
});

function btnText() {
  const value = props.data
  // console.log('value', value);

  // if values is not a list, return
  // if (!Array.isArray(value)) {
  //   return "No diffs";
  // }
  // 
  // if (value.length === 0) {
  //   return "No diffs";
  // } else {
    const countCRIS = value
      .map((v) => {
        if (v.cris) {
          return v.path;
        }
      })
      .filter((v) => v);
    const countRIS = value
      .map((v) => {
        if (v.ris) {
          return v.path;
        }
      })
      .filter((v) => v);
    console.log(countCRIS, countRIS);

    let text = "";
    if (countCRIS.length > 0) {
      // text += `CRIS: ${countCRIS.join(", ")}`;
      text += `CRIS: ${countCRIS.length}, `;
    }
    if (countRIS.length > 0) {
      text += `RIS: ${countRIS.length}`;
    }
    return text;
  // }
}

function newFn() {
  // TODO
}
</script>
