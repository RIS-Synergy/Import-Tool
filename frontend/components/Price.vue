Example:

395.587,50 EUR

<template>
  <span>{{ formatPrice(props.amount) }} {{ currency(props.currency) }}</span>
</template>

<script setup>
const props = defineProps({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
  },
});

// credit to https://stackoverflow.com/questions/43208012/how-do-i-format-currencies-in-a-vue-component
function formatPrice(value) {
  let val = (value/1).toFixed(2).replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

function currency (str) {
  switch (str) {
    case 'EUR':
      return '€'
    case 'USD':
      return '$'
    default:
      return str
  }
}
</script>

<style scoped></style>
