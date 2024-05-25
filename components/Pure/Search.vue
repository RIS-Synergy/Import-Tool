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
        <th class="text-left">Name</th>
        <th class="text-left">
          Action

          <v-dialog max-width="800">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                size="small"
                text="Create"
                variant="flat"
                v-bind="activatorProps"
              ></v-btn>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="Create Person">
                <v-card-text> TODO </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    text="Close Dialog"
                    @click="isActive.value = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(p, itm) in search.persons" :key="itm">
        <td>{{ p.pureId }}</td>
        <td>{{ p.name }}</td>
        <td>
          <v-dialog max-width="800">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                v-bind="activatorProps"
                size="small"
                text="View"
                variant="flat"
              ></v-btn>
              <v-icon v-if="selected === p"
                      @click="selected = null"
                      icon="mdi-checkbox-marked-circle" />
              <v-icon v-else
                      @click="selected = p"
                      icon="mdi-checkbox-blank-circle-outline" />
            </template>

            <PureView :data="p" />
          </v-dialog>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
const model = defineModel();

const searchString = ref(model.value.firstName + " " + model.value.familyName);

function searchSave () {
  // console.log('searchSave', searchString)
  searchApi(searchString)
}

const search = ref(null);

async function searchApi(str: string) {
  search.value = await $fetch("/api/ri/persons/search", {
    method: "POST",
    body: JSON.stringify({
      searchString: str.value
    }),
  });
}

const selected = ref(null);

onMounted(() => {
  searchApi(searchString);
})
</script>

<style></style>
