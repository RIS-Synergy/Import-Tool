<template>
  <v-container>
    <v-row class="">
      <v-spacer></v-spacer>
      <!-- toggle edit btn -->
      <v-btn @click="store.toggleEdit">
        {{ store.isEdit ? 'View' : 'Edit' }}
      </v-btn>
    </v-row>

    <YamlEditor :data="data.jsonTemplate" />
  </v-container>
</template>

<script setup>
const props = defineProps({
  // templateType: String
})

const templateType = computed(() => {
  return route.name.split('-')[1]
});

const route = useRoute()
console.log(route)

const { getTemplateId } = useApiUtils();
const data = await getTemplateId(templateType.value, route.params.id);

const store = useTemplateStore();
store.templateTitle = data.name;
store.templateId = data.id;

// on route leave
onBeforeRouteLeave((to, from) => {
  store.reset();
});
</script>
