<template>
  <div>
    <v-chip
      class="mr-1 mt-2"
      :class="chipClass(ex)"
      :color="chipColor(ex)"
      size="small"
      variant="outlined"
      v-for="ex in externals"
    >
      {{ ex.templateType }}
    </v-chip>
  </div>
  <!-- if not, press button. (optoional)
       otherwise it will be fetched in the project/[id]/transform -->
</template>

<script setup>
const props = defineProps({
  externals: {
    type: Object,
    required: true,
  },
});

function chipClass(ex) {
  return "foo";
}

  function chipColor(ex) {
    switch (ex.templateType) {
      case "PROJECT":
        return "indigo";
      case "APPLICATION":
        return "teal";
      case "AWARD":
        return "deep-purple";
      default:
        return "green";
    }
  }
</script>

<style scoped>
.PROJECT = {
}
</style>
