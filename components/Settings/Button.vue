<template>
  <v-dialog max-width="800">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        class="text-none"
        variant="flat"
        rounded
        width="12em"
        v-bind="activatorProps"
        color="grey"
      >
        Settings ({{store.numberOfSettings}} / {{store.totalNumOfSettings}})
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Settings">
        <SettingsView />
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const store = useProjectStore();

// const n = ref(0)
// const m = ref(0)
// 
// function getSettingsParam () {
//   // x out of y
//   Object.entries(store.settings).forEach(([key, value]) => {
//     console.log(key, value);
//     if (value) {
//       n.value = n.value + 1
//     }
//     m.value = m.value + 1
//   });
//   return { n, m }
// }
// 
// getSettingsParam()
</script>

<style scoped>
</style>
