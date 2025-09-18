<template>
  <v-container>
    <v-table density="compact">
      <thead>
        <tr>
          <th>Name</th>
          <th>Domain</th>
          <th>ROR</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.domain }}</td>
          <td>
            <v-btn
              class=""
              variant="outlined"
              size="small"
              color="grey"
              :href="rorUrl(item.rorId)"
              target="_blank"
            >
              <v-icon class=""> mdi-open-in-new </v-icon>
              ROR
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
const { ri } = useApiUtils();
const { listAll } = (await ri).default;
const data = await listAll();

function rorUrl(id) {
  return `https://ror.org/${id}`;
}
</script>
