<template>
  <ProjectView v-if="store && store.risData" v-model="store.risData" />
</template>

<script setup>
const store = useProjectStore();
// const route = useRoute();
// const routes = useRouter();
// 
// const id = route.params.id;
// const { data } = await useFetch(`/api/fa/projects/${id}`);
// 
// const transformLink = computed(() => {
//   return { name: "project-id-transform", params: { id } };
// });
// 
// // when leaving this route, console.log()
// onBeforeRouteLeave((to, from, next) => {
//   console.log("leaving", from, to);
//   next();
// });
// 
definePageMeta({
  layout: "project"
});
</script>
