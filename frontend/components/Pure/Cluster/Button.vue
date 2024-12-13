<template>
  <div v-if="store.projectSelected && itemIsSameAsSelected()">
    <v-btn
      v-if="!itemIsNotAlligned()"
      class="text-none"
      variant="outlined"
      rounded
      width="12em"
      color="primary"
      @click="assignCluster"
    >
      Assign cluster
    </v-btn>
    <v-sheet
      dense
      class="mt-2"
      v-if="store.projectSelected && !itemIsNotAlligned()"
    >
      Assign <b>{{ item.systemName }}</b> cluster to selected project
      <i>{{ store.projectSelected.pureId }}</i
      >.
    </v-sheet>
    <!-- <v-sheet v-if="store.projectSelected && itemIsNotAlligned()">
         Project <i>{{store.projectSelected.pureId}}</i> already has an <b>{{item.systemName}}</b> cluster assigned.
         </v-sheet> -->
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object,
});

const store = useProjectStore();

function projectSelected() {
  return store.templateSelect.project;
}

function itemIsSameAsSelected() {
  const entity = props.item.systemName.toLowerCase();
  return store.templateSelect[entity] === props.item.uuid;
}

function itemIsNotAlligned() {
  const entity = props.item.systemName.toLowerCase();

  // project is selected
  if (store.projectSelected && store.projectSelected[entity + "Cluster"]) {
    const entityCluster = store.projectSelected[entity + "Cluster"];
    console.log("entityCluster", entityCluster);
    return true;
  } else {
    console.log("no entityCluster");
    return false;
  }
}

function assignCluster() {
  // TODO
  console.log("assignCluster");
}
</script>
