<script setup lang="ts">
import { useOefosStore } from "~/stores/oefos";

const props = defineProps<{
  code: string;
  title: string;
  subtitle?: string;
}>();

const store = useOefosStore();

onMounted(async () => {
  if (!store.loaded) await store.fetchAll();
});

const navigateOefos = (code: string) => {
  navigateTo({
    path: "/projects/all",
    query: { oefos: code },
  });
};

const hierarchy = computed(() => {
  if (!store.loaded) return [];
  const path = [];
  let currentCode = props.code;
  while (currentCode) {
    const de = store.entries.de.find((e) => e.Code === currentCode);
    const en = store.entries.en.find((e) => e.Code === currentCode);

    if (de) {
      path.unshift({
        Code: currentCode,
        TitelDe: de.Titel,
        TitelEn: en?.Titel || de.Titel,
      });
    }

    if (currentCode.length === 6) currentCode = currentCode.substring(0, 4);
    else if (currentCode.length === 4) currentCode = currentCode.substring(0, 3);
    else if (currentCode.length === 3) currentCode = currentCode.substring(0, 1);
    else currentCode = "";
  }
  return path;
});
</script>

<template>
  <div class="pa-1 rounded">
    <div class="">
      <v-menu open-on-hover :close-on-content-click="false" location="end" offset="15">
        <template v-slot:activator="{ props: menuProps }">
          <span
            v-bind="menuProps"
            class="font-weight-bold mr-1 category-code"
            @click="navigateOefos(code)"
            >{{ code }},</span
          >
        </template>

        <v-card class="pa-3" min-width="500">
          <div
            v-for="(node, index) in hierarchy"
            :key="node.Code"
            class="d-flex align-baseline py-1"
            :style="{ marginLeft: index * 20 + 'px' }"
          >
            <div class="mr-2 text-grey-lighten-1">•</div>
            <div class="text-caption">
              <span
                class="font-weight-bold mr-1 category-code"
                @click="navigateOefos(node.Code)"
                >{{ node.Code }}.</span
              >
              <span class="text-grey-darken-3">{{ node.TitelDe }}</span>
              <span class="mx-1 text-grey-lighten-1">/</span>
              <span class="text-grey">{{ node.TitelEn }}</span>
            </div>
          </div>
        </v-card>
      </v-menu>
      <span>{{ title }}</span>
    </div>
    <div v-if="subtitle" class="text-caption text-grey">{{ subtitle }}</div>
  </div>
</template>

<style scoped>
.category-code {
  cursor: pointer;
}
.category-code:hover {
  text-decoration: underline;
  color: rgb(var(--v-theme-primary));
}
</style>
