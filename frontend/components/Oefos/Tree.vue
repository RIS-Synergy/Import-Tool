<script setup lang="ts">
import { type OefosNode, useOefosStore } from "~/stores/oefos";

const props = defineProps<{
  nodes: OefosNode[];
}>();

const store = useOefosStore();
const expanded = ref<Set<string>>(new Set());

const toggleExpand = (code: string) => {
  if (expanded.value.has(code)) {
    expanded.value.delete(code);
  } else {
    expanded.value.add(code);
  }
};

const toggleSelect = (code: string) => {
  store.toggleSelection(code);
};

onMounted(() => {
  props.nodes.forEach((node) => {
    // Expand Level 1 nodes by default (the top six parts)
    if (node.Ebene === "1") {
      expanded.value.add(node.Code);
    }
  });
});
</script>

<template>
  <div class="oefos-tree">
    <div
      v-for="(node, index) in nodes"
      :key="node.Code"
      class="oefos-node"
      :class="{ 'is-last': index === nodes.length - 1 }"
    >
      <div
        class="oefos-node-content"
        :class="{ 'has-children': node.children.length > 0 }"
      >
        <span
          v-if="node.children.length > 0"
          class="expand-icon"
          @click.stop="toggleExpand(node.Code)"
        >
          <v-icon
            size="small"
            :color="expanded.has(node.Code) ? 'primary' : ''"
          >
            {{
              expanded.has(node.Code) ? "mdi-chevron-down" : "mdi-chevron-right"
            }}
          </v-icon>
        </span>
        <span v-else class="leaf-dot">
          <v-icon size="x-small" color="grey-lighten-1"
            >mdi-circle-small</v-icon
          >
        </span>

        <div class="checkbox-container" @click="toggleSelect(node.Code)">
          <div
            class="custom-checkbox"
            :class="{ 'is-selected': store.isSelected(node.Code) }"
          >
            <v-icon
              v-if="store.isSelected(node.Code)"
              size="x-small"
              color="white"
              >mdi-check</v-icon
            >
          </div>
        </div>

        <div
          class="node-text"
          @click="node.children.length > 0 && toggleExpand(node.Code)"
        >
          <span class="oefos-code">{{ node.Code }}.</span>
          <span class="oefos-title">{{ node.Titel }}</span>
        </div>
      </div>

      <div
        v-if="node.children.length > 0 && expanded.has(node.Code)"
        class="oefos-children"
      >
        <OefosTree :nodes="node.children" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.oefos-tree {
  /* font-family: "Inter", sans-serif; */
  font-size: 0.95rem;
  /* color: #2c3e50; */
}

.oefos-node {
  margin-left: 24px;
  position: relative;
  border-left: 1px dashed rgba(0, 0, 0, 0.1);
}

.oefos-node::before {
  content: "";
  position: absolute;
  top: 18px;
  left: 0;
  width: 12px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

.oefos-node.is-last {
  border-left: none;
}

.oefos-node.is-last::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  border-left: 1px dashed rgba(0, 0, 0, 0.1);
}

.oefos-node-content {
  display: flex;
  align-items: center;
  padding: 6px 0;
  margin-left: 12px;
  transition: background-color 0.2s;
  border-radius: 4px;
}

.oefos-node-content:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.expand-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 4px;
  z-index: 1;
  transition: transform 0.2s;
}

.leaf-dot {
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
}

.checkbox-container {
  cursor: pointer;
  padding: 4px;
  margin-right: 8px;
  display: flex;
  align-items: center;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.custom-checkbox.is-selected {
  background-color: #1976d2;
  border-color: #1976d2;
  box-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
}

.node-text {
  display: flex;
  align-items: center;
  flex-grow: 1;
  cursor: pointer;
  user-select: none;
}

.oefos-code {
  font-weight: 600;
  margin-right: 12px;
  color: #546e7a;
  font-variant-numeric: tabular-nums;
}

.oefos-title {
  font-weight: 500;
}

.oefos-children {
  /* space for nesting already handled by .oefos-node margin */
}
</style>
