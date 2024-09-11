<template>
  <div>
    <h2>{{ templateType }} List</h2>
    <!-- template list, type {{ props.templateType }} -->

    <pre>
      {{ data }}
    </pre>

    <v-list>
      <v-list-item>
        <v-btn :to="`${templateType}/1`">
          1
        </v-btn>
      </v-list-item>
    </v-list>

  </div>
</template>

<script setup>
const props = defineProps({
  templateType: String
})

// const route = useRoute()
// console.log('templateType', props.templateType, 'on route', route.fullPath)

// watch(route, () => {
//   console.log('route changed', route.fullPath)
// })
// const templates = ref([]);
const { getTemplates } = useApiUtils();
const data = await getTemplates(props.templateType);
</script>
