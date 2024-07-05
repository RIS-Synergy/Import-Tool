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
            v-if="selected === p"
            @click="selected = null"
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
const { setPerson } = useProjectStore();

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
  searchApi(searchString, 'persons');
}

const search = ref(null);

async function searchApi(str: string, entity: string) {
  search.value = await $fetch("/api/ri/search", {
    method: "POST",
    body: JSON.stringify({
      searchString: str.value,
      entity
    }),
  });
}

const selected = ref(null);

watch(selected, (val) => {
  if (val) {
    setPerson(val.uuid);
  } else {
    setPerson(null);
  }
});

onMounted(() => {
  searchApi(searchString, 'persons');
});
</script>

<style scoped>
.similarity {
  font-size: 0.9em;
  color: #676;
}
</style>
