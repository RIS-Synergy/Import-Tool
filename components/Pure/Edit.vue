<template>
  <v-row
    no-gutters
    @mouseover="edit = true"
    @mouseleave="edit = false">
    <v-col class="label" sm="2">{{ label }}</v-col>
    <v-col sm="9">
      <v-text-field
        v-if="allowEdit"
        density="compact"
        v-model="text"
        variant="underlined"
        append-inner-icon="mdi-content-save"
        @click:append-inner="save"
        v-on:keyup.enter="save"
      />
      <div v-else>
        {{ text }}
      </div>
    </v-col>
    <v-col v-if="edit && !allowEdit" sm="1">
      <v-icon icon="mdi-pencil" @click="allowEdit = true" />
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

const item = props.item;

function useLang (item, lang = 'en_GB') {
  return item[lang];
}

function save () {
  console.log('save icon')
  allowEdit.value = false;
  edit.value = false
}
const text = useLang(item);

const edit = ref(false);
const allowEdit = ref(false);
</script>

<style scoped>
.label {
  font-weight: bold;
}
</style>
