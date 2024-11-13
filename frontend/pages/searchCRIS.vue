<template>
  <v-container>
    <h2>CRIS Search</h2>
    <v-row align="center">
      <v-col cols="11">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          @keydown.enter="startSearch"
        >
        </v-text-field>
      </v-col>
      <v-col cols="1" class="mt-n4">
        <v-btn class="mt-3" icon @click="startSearch">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <i>Count: {{ result.length }}</i>
    <v-table v-if="result.length">
      <thead>
        <tr>
          <th>CRIS ID</th>
          <th>CRIS UUID</th>
          <th>Entity</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in result" key="item.uuid">
          <td>{{ item.pureId }}</td>
          <td>{{ item.uuid }}</td>
          <td>{{ item.entity }}</td>
          <v-dialog max-width="1400">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                class="mt-2"
                v-bind="activatorProps"
                text="View"
                variant="outlined"
              ></v-btn>
            </template>

            <template v-slot:default="{ isActive }">
              <PureUUID
                :uuid="item.uuid"
                :entity="item.entity"
              />
            </template>
          </v-dialog>

        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
const search = ref("");
const result = ref([]);

const { searchAny } = useApiUtils();

async function startSearch() {
  result.value = await searchAny(search.value);
}
</script>
