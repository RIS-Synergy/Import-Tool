<template>
  <v-container>
    <div v-if="fale" class="text-h4 mb-2">Templates: {{ templateType }}</div>
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
            <v-btn v-if=false :to="`${templateType}/${item.id}`">
              Edit
            </v-btn>
            <v-btn :to="`${templateType}/${item.id}`">
              View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

    </v-row>


    <v-dialog v-model="dialog" max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <v-fab
      color="primary"
      icon="mdi-plus"
      class="mb-4"
      location="bottom end"
      app
          @click="dialog = true"
    ></v-fab>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card title="New Template">
          <v-card-text>
            <v-text-field
              v-model="name"
              label="Name"
              required
            ></v-text-field>
            <v-textarea
              v-model="description"
              label="Description"
              required
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="create">
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

  </v-container>
</template>

    <script setup>
    const props = defineProps({
      templateType: String
    })

    const dialog = ref(false)
    const name = ref('')
const description = ref('')

const store = useTemplateStore()

const { createTemplate } = useApiUtils()

async function create () {
  const result = await createTemplate(props.templateType,
    name.value,
    description.value
  )
}

// const route = useRoute()
// console.log('templateType', props.templateType, 'on route', route.fullPath)

// watch(route, () => {
//   console.log('route changed', route.fullPath)
// })
// const templates = ref([]);
const { getTemplates } = useApiUtils();
const data = await getTemplates(props.templateType);
</script>
