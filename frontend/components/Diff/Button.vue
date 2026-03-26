<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ props: activatorProps }">
      <div class="mt-1 text-warning" v-if="!templateSelected">
        Template not selected
      </div>
      <div v-else class="diff">
        <v-btn
          v-if="false"
          v-bind="activatorProps"
          text="View"
          @click="isActive = true"
          variant="tonal"
        ></v-btn>
        <DiffText v-if="diffList" :data="diffList" @click="dialog = true" />
        <div class="modifiedDate">
          {{modDate(modifiedDate)}}
        </div>
      </div>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-text>
          <DiffView :diff-list="diffList" />
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
// const route = useRoute();
// const id = route.params.id;
import { formatDistance } from "date-fns";
function modDate(date) {
  if (!date) return "Never";
  return formatDistance(date, new Date(), { addSuffix: true });
}

const dialog = ref(false);

const store = useProjectStore();

const props = defineProps({
  risId: String,
  pureId: {
    type: String,
    required: true,
  },
  systemName: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  },
  externalEntityId: {
    type: Number,
  },
});

const { cris } = useApiUtils();
const { getDiffs } = (await cris).default;

const isActive = ref(false);
// const diffList = ref([]);
const diffList = ref(null);
const modifiedDate = ref(null);

onMounted(async () => {
  const result = await getDiffs(
    props.risId,
    props.systemName,
    props.uuid,
    templateSelected.value,
    props.externalEntityId,
  );
  diffList.value = result && result.diffList;
  modifiedDate.value = result && result.modifiedDate;
});

const templateSelected = computed(() => {
  return store.getTemplateByEntity(props.systemName);
});

function btnText() {
  const { value } = diffList;
  // console.log('value', value);

  // if values is not a list, return
  if (!Array.isArray(value)) {
    return "No diffs";
  }

  if (value.length === 0) {
    return "No diffs";
  } else {
    const countCRIS = value
      .map((v) => {
        if (v.cris) {
          return v.path;
        }
      })
      .filter((v) => v);
    const countRIS = value
      .map((v) => {
        if (v.ris) {
          return v.path;
        }
      })
      .filter((v) => v);
    console.log(countCRIS, countRIS);

    let text = "";
    if (countCRIS.length > 0) {
      // text += `CRIS: ${countCRIS.join(", ")}`;
      text += `CRIS: ${countCRIS.length}, `;
    }
    if (countRIS.length > 0) {
      text += `RIS: ${countRIS.length}`;
    }
    return text;
  }
}
</script>

<style scoped>
.diff {
  /* background-color: lightgrey; */
  /* padding: 10px; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: self-end;
  width: 100%;
}

.modifiedDate{
  font-style: italic;
  font-size: 1em;
  opacity: 0.4;
}
</style>
