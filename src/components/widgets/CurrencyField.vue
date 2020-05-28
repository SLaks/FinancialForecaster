<template>
  <v-text-field
    :value="formattedValue"
    @input="forwardEvent($event, 'input')"
    @change="forwardEvent($event, 'change')"
    v-bind="$attrs"
    type="tel"
    v-currency-directive="$props"
    @keydown.up="setValue(value + keyFactor($event))"
    @keydown.down="setValue(value - keyFactor($event))"
  />
</template>

<script>
import { CurrencyDirective } from "vue-currency-input";
import { setValue } from "vue-currency-input/src/api";

export default {
  name: "CurrencyField",
  props: {
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
      default: "USD"
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
  },
  directives: { CurrencyDirective },
  data() {
    return {
      formattedValue: null
    };
  },
  created() {
    if (typeof this.value !== "number") {
      this.formattedValue = null;
      return;
    }

    let minimumFractionDigits = 2;
    let maximumFractionDigits = 2;

    if (typeof this.precision === "number") {
      minimumFractionDigits = maximumFractionDigits = this.precision;
    } else if (typeof this.precision === "object" && !this.autoDecimalMode) {
      minimumFractionDigits = this.precision.min || 0;
      maximumFractionDigits =
        this.precision.max !== undefined ? precision.max : 20;
    }

    this.formattedValue = this.value.toLocaleString(this.locale, {
      minimumFractionDigits,
      maximumFractionDigits
    });
  },
  watch: {
    value: "setValue"
  },
  methods: {
    setValue(value) {
      setValue(this.$el.querySelector("input"), value);
    },

    forwardEvent(value, type) {
      const input = this.$el.querySelector("input");
      if (input.$ci) {
        const numberValue = input.$ci.numberValue;
        if (this.value !== numberValue) this.$emit(type, numberValue);
      }
      this.formattedValue = value;
    },

    /** @param {KeyboardEvent} e */
    keyFactor(e) {
      const factor = e.altKey ? 0.1 : 10;
      let value = e.altKey ? 0.1 : 1;
      if (e.shiftKey) value *= factor;
      if (e.ctrlKey) value *= factor * factor;
      return value;
    }
  }
};
</script>