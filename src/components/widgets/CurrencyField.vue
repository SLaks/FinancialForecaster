<template>
  <v-input v-bind="$props"  class="v-text-field">
    <currency-input v-bind="$props" @input="$emit('input', $event)" />
  </v-input>
</template>

<script>
import { CurrencyInput } from "vue-currency-input";

export default {
  components: { CurrencyInput },
  props: {
    label: {
      type: String,
      default: undefined
    },
    hint: {
      type: String,
      default: undefined
    },
    value: {
      type: Number,
      default: 0
    },
    locale: {
      type: String,
      default: undefined
    },
    currency: {
      type: [String, Object],
      default: 'USD'
    },
    distractionFree: {
      type: [Boolean, Object],
      default: false
    },
    precision: {
      type: [Number, Object],
      default: undefined
    },
    autoDecimalMode: {
      type: Boolean,
      default: undefined
    },
    valueAsInteger: {
      type: Boolean,
      default: undefined
    },
    valueRange: {
      type: Object,
      default: undefined
    },
    allowNegative: {
      type: Boolean,
      default: undefined
    }
  }
};
</script>