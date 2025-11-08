<template>
  <div v-if="canAssignCluster()">
    <v-btn
      v-if="!itemIsNotAlligned()"
      class="text-none"
      variant="outlined"
      rounded
      width="12em"
      color="primary"
      @click="assignCluster(projectSelected(), item)"
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
    // console.log("no entityCluster");
    return false;
  }
}

function projectHasCluster () {
  const entity = props.item.systemName.toLowerCase();
  return store.projectSelected && store.projectSelected[entity + "Cluster"];
}

function canAssignCluster () {
  // Project should not have a cluster assigned
  const validClusterEntity = ['Application', 'Award'] // props.item.systemName 
  if (!validClusterEntity.includes(props.item.systemName)) {
    return false;
  }

  // Project should be selected
  const a = store.projectSelected;
  // Cluster should not be assigned to project
  const b = itemIsSameAsSelected();
  // Project should not have a cluster assigned
  const c = !projectHasCluster();
  const result = a && b && c;
  return result;
}

const { cris } = useApiUtils()
const { assignCluster } = (await cris).default;
</script>
