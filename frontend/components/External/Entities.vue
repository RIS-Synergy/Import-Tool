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
        <v-chip
          v-if="st.diffList.length > 0"
          size="x-small"
          color="red"
          class="cursor-pointer"
          @click.stop="showDiffs(st.diffList)"
        >
          <b>
            {{ st.diffList.length }}
          </b>
        </v-chip>
        <v-chip
          v-else
          size="x-small"
          color="green"
          class="cursor-pointer"
          @click.stop="showDiffs(st.diffList)"
        >
          <v-icon> mdi-check </v-icon>
        </v-chip>
      </span>
    </v-chip>

    <v-dialog v-model="dialog" max-width="1200">
      <v-card>
        <v-card-text>
          <DiffView
            v-if="selectedDiffList"
            :diff-list="selectedDiffList"
            :show-button="false"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close" @click="dialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

const dialog = ref(false);
const selectedDiffList = ref(null);

function showDiffs(diffList) {
  selectedDiffList.value = diffList;
  dialog.value = true;
}

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
/* .PROJECT { } */

.tiny {
  font-size: 0.7em;
}

.vertical-hight-bug {
  margin-bottom: 0.5px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
