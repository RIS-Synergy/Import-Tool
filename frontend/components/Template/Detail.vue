<template>
  <v-container>
    <ClientOnly>
      <YamlEditor :data="data.yamlTemplate" />
    </ClientOnly>
  </v-container>
</template>

<script setup>
const props = defineProps({
  // templateType: String
});

const templateType = computed(() => {
  return route.name.split("-")[1];
});

const route = useRoute();
console.log(route);

const { template } = useApiUtils();
const { getTemplateId, verifyTemplate } = (await template).default;
const data = await getTemplateId(templateType.value, route.params.id);

const store = useTemplateStore();
store.templateTitle = data && data.name;
store.templateId = data && data.id;

// on route leave
onBeforeRouteLeave((to, from) => {
  store.reset();
});
</script>
