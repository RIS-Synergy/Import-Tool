<template>
  <v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-if="result"
        variant="flat"
        rounded
        size="small"
        class="ma-1"
        :class="orgClass"
        v-bind="activatorProps"
      >
        <span v-if="data.systemName === 'Organization'" >
          {{ orgShorten() }}
        </span>
        <span v-if="data.systemName === 'User'">
          {{ result.username }}
        </span>
      </v-btn>
      <v-chip v-if="sameEmail" color="green" variant="flat">@</v-chip>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-text>
          <Yaml :json="result" />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  period: {
    type: Object,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
});

const { systemName, uuid } = props.data;

const result = ref(null);

const orgClass = computed(() => {
  if (!props.period) return
  const { startDate, endDate } = props.period;
  const current = startDate && !endDate && true
  return {
    current,
    notCurrent: !current,
  };
});

function orgShorten () {
  const { name } = result.value
  if (!name) return '_'
  const text = name.en_GB || name.de_DE || '_'

  const firstWordsCut = ['Department of ', 'Institut für ']
  const rest = firstWordsCut.reduce((acc, cur) => {
    return acc.replace(cur, '')
  }, text)

  const numberOfText = 12
  return rest.length > numberOfText ? rest.slice(0, numberOfText) + '...' : rest
}

const sameEmail = computed(() => {
  if (!props.email) return false
  if (!result.value) return false
  // compare both lowercase
  return props.email.toLowerCase() === result.value.email.toLowerCase()
});

onMounted(() => {
  $fetch(`/api/ri/reference/${systemName}/${uuid}`).then(
    (res) => (result.value = res),
  );
});
</script>

<style scoped>
.v-btn {
  color: #333;
  background-color: #ccc;
}

.current {
  color: green;
  background-color: lightgreen;
}

.notCurrent {
  display: none;
}

.email {
  color: green;
  background-color: lightgreen;
}
</style>
