<template>
  <div>
    <v-chip
      class="mr-1 mt-2"
      label
      :class="chipClass(ex)"
      :color="chipColor(ex)"
      size="small"
      variant="outlined"
      v-for="ex in externals"
    >
      {{ ex.templateType }}
      <span class="ml-1 vertical-hight-bug" v-for="st in ex.SavedTemplate">
        <!-- {{ st.diffList.length }} -->
        <v-chip v-if="st.diffList.length > 0" size="x-small" color="red">
          <b>
            {{ st.diffList.length }}
          </b>
        </v-chip>
        <v-chip v-else size="x-small" color="green">
          <v-icon> mdi-check </v-icon>
        </v-chip>
      </span>
    </v-chip>
    <pre v-if="false" class="tiny">
      {{ externals }}
    </pre>
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

.tiny {
  font-size: 0.7em;
}

.vertical-hight-bug {
  margin-bottom: 0.5px;
}
</style>
