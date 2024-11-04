<template>
  <v-text-field
    v-model="searchString"
    class="ma-2"
    density="compact"
    placeholder="Search name..."
    hide-details
    v-on:keyup.enter="searchSave"
  ></v-text-field>
  <v-table v-if="search" density="compact">
    <thead>
      <tr>
        <th class="text-left">Pure ID</th>
        <th class="text-left">System Name</th>
        <th class="text-left">Name</th>
        <th class="text-left">User</th>
        <th class="text-left">Organizations</th>
        <th class="text-left">Similarity</th>
        <th class="text-left">Select</th>
        <th class="text-left">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(p, itm) in search" :key="itm">
        <td>{{ p.pureId }}</td>
        <td>{{ p.systemName }}</td>
        <td>{{ p.name }}</td>
        <td>
          <PureReference
            v-if="p.details.user"
            :data="p.details.user"
            :email="props.email"
            :parentUuid="p.uuid"
          />
        </td>
        <td>
          <PureReference
            v-for="x in p.details.staffOrganizationAssociations"
            :data="x.organization"
            :period="x.period"
          />
        </td>
        <td>
          <span class="similarity mr-2">
            {{ (useSimilarity(searchString, p.name) * 100).toFixed(0) + "%" }}
          </span>
        </td>
        <td>
          <v-icon
            v-if="selected === p || settings.person === p.uuid"
            @click="selected = null ; setPerson(null)"
            icon="mdi-checkbox-marked-circle"
          />
          <v-icon
            v-else
            @click="selected = p"
            icon="mdi-checkbox-blank-circle-outline"
          />
        </td>
        <td>
          <v-dialog max-width="1200">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                v-bind="activatorProps"
                size="small"
                text="View"
                variant="flat"
              ></v-btn>
            </template>
            <PureView :data="p" />
          </v-dialog>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
// use the store
const { setPerson, settings } = useProjectStore();

const model = defineModel();

const props = defineProps({
  email: {
    type: String,
    required: false,
  },
});

const searchString = ref(model.value.firstName + " " + model.value.familyName);

function searchSave() {
  // console.log('searchSave', searchString)
  searchApiPost(searchString, 'persons');
}

const search = ref(null);

const { searchApi } = useApiUtils();

async function searchApiPost(str: string, entity: string) {
  const result = await searchApi(str.value, entity);
  search.value = result;
}

const selected = ref(null);
// const selected = ref(settings.person);

watch(selected, (val) => {
  if (val) {
    setPerson(val.uuid);
  } else {
    setPerson(null);
  }
});

onMounted(() => {
  searchApiPost(searchString, 'persons');
});
</script>

<style scoped>
.similarity {
  font-size: 0.9em;
  color: #676;
}
</style>
