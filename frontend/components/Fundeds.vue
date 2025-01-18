<template>
  <div v-for="(x, idx) in model" :key="idx">
    <div v-if="x.by">
      By: <span class="bold">{{ x.by.id }}</span>
      <div v-if="x.by.type">
        Type: {{ x.by.type }}
      </div>
      <LangTrans v-model="x.by.name" />
    </div>
    <div v-if="x.as">
      As: {{ x.as.id }} <br/>
      <div v-if="x.as.type">
        Type: <span class="bold">{{ x.as.type }}</span>
      </div>
      <LangTrans v-model="x.as.name" />
      <div class="mb-1">
        <h4>Amount</h4>
        <Price :amount="x.as.amount.amount" :currency="x.as.amount.currency" />
      </div>
      <div v-for="({ orgUnit }, idx) in x.as.recipients" :key="idx">
        <h4>OrgUnit</h4>
        <OrgUnit :id="orgUnit.id" :names="orgUnit.name" :identifiers="orgUnit.identifiers" />
      </div>
    </div>
  </div>
</template>

<script setup>
const model = defineModel();
</script>

<style scoped>
.bold {
  font-weight: bold;
}
</style>
