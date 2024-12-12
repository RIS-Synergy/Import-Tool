<template>
  <div>
    <PureTable :data="crisEntities" />
    <!-- <PureDiff
         v-if="entityType === 'project'"
         class="mb-2"
         :templateId="templateId"
         /> -->
    <!-- <TransformButton
         v-if="canCreateNew()"
         class="mt-2"
         :entityType="entityType"
         /> -->
  </div>
</template>

<script setup>
const props = defineProps({
  entityType: {
    type: String,
    required: true,
  },
  crisEntities: {
    type: Array,
    default: () => [],
  },
});

const store = useProjectStore();

const templateId = computed(() => {
  const typeId = props.entityType + "Id";
  return store.template[typeId];
});

function canCreateNew () {
  // console.log(store.)

  // if none exists

  // if one exist

  return true
}

</script>
