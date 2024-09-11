<template>
  <v-container>
    <div class="text-h4 mb-2">Templates: {{ templateType }}</div>
    <v-row>

      <v-col cols="6" v-for="item in data">
        <v-card   >
          <v-card-title>
            {{ item.name }}
          </v-card-title>
          <v-card-text>
            {{ item.description }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :to="`${templateType}/${item.id}`">
              Edit
            </v-btn>
            <v-btn :to="`${templateType}/${item.id}`">
              View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
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
