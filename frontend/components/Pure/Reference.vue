<template>
  <v-dialog max-width="1200">
    <template v-slot:activator="{ props: activatorProps }">
      <v-chip
        v-if="result && data.systemName === 'Organization'"
        class="mr-1 mt-1"
        :class="orgClass"
      >
        <v-btn
          v-if="!orgIsAssigned"
          variant="flat"
          rounded
          size="x-small"
          class="mr-1"
          @click="assignGroup"
        >
          +
        </v-btn>
        <span
          v-bind="activatorProps"
          :style="{ cursor: 'pointer' }"
        >
          {{ orgShorten() }}
        </span>
      </v-chip>

      <v-btn
        v-if="result && data.systemName === 'User'"
        variant="flat"
        rounded
        size="small"
        class="ma-1"
        :class="orgClass"
        v-bind="activatorProps"
      >
        <span v-if="data.systemName === 'User'">
          {{ result.username }}
        </span>
      </v-btn>
      <v-chip v-if="sameEmail" color="green">@</v-chip>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-actions class="">
          <v-dialog max-width="800">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn class="float-right" v-bind="activatorProps">
                Assign Setting
              </v-btn>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="Settings">
                <SettingsView :assign="data" />
              </v-card>
            </template>
          </v-dialog>
        </v-card-actions>

        <v-card-text>
          <Yaml :json="result" />
        </v-card-text>
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
  parentUuid: {
    type: String,
    required: false,
  },
});

const { systemName, uuid } = props.data;

const result = ref(null);

const orgClass = computed(() => {
  if (!props.period) return;
  const { startDate, endDate } = props.period;
  if (!endDate) return { current: true };
  const current = endDate.startsWith("9999-") || !endDate;
  return {
    current,
    // disable this after removing the organizations that have more than 1 sasme org units.
    // notCurrent: !current
  };
});

function orgShorten() {
  const { name } = result.value;
  if (!name) return "_";
  const text = name.en_GB || name.de_DE || "_";

  const firstWordsCut = ["Department of ", "Institut für "];
  const rest = firstWordsCut.reduce((acc, cur) => {
    return acc.replace(cur, "");
  }, text);

  const numberOfText = 50;
  return rest.length > numberOfText
    ? rest.slice(0, numberOfText) + "..."
    : rest;
}

const store = useProjectStore();

const sameEmail = computed(() => {
  if (!props.email) return false;
  if (!result.value) return false;
  // compare both lowercase
  const same = props.email.toLowerCase() === result.value.email.toLowerCase();
  if (same) {
    store.setPerson(props.parentUuid);
  }
  return same;
});

const orgIsAssigned = computed(() => {
  return store.settings.organization === props.data.uuid;
});

function assignGroup() {
  return (store.settings.organization = props.data.uuid);
}

onMounted(async () => {
  const { cris } = useApiUtils();
  const { referenceApi } = (await cris).default;
  const res = await referenceApi(systemName, uuid);

  result.value = res;
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
  opacity: 0.5;
}

.email {
  color: green;
  background-color: lightgreen;
}
</style>
