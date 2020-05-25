<template>
  <v-text-field
    ref="textfield"
    v-model="formattedValue"
    v-bind="attrs"
    v-on="listeners()"
    type="tel"
    v-currency-directive="{currency, locale, distractionFree, precision: decimalLength, autoDecimalMode: decimalMode, valueRange, allowNegative, valueAsInteger}"
  >
    <template v-for="(index, name) in $slots" v-slot:[name]>
      <slot :name="name" />
    </template>
  </v-text-field>
</template>

<script>
import dispatchEvent from "vue-currency-input/src/utils/dispatchEvent";
import { stripCurrencySymbolAndMinusSign, toInteger } from "./formatHelper";
import parse from "vue-currency-input/src/utils/parse";
import { CurrencyDirective } from "vue-currency-input";

export default {
  name: "CurrencyField",
  props: {
    value: { type: [Number, String] },
    locale: { type: String },
    currency: { type: [String, Object] },
    decimalLength: { type: Number },
    autoDecimalMode: { type: Boolean },
    min: { type: Number },
    max: { type: Number },
    defaultValue: { type: Number },
    valueAsInteger: { type: Boolean },
    allowNegative: { type: Boolean }
  },
  directives: { CurrencyDirective },
  data() {
    return {
      formattedValue: this.value
    };
  },
  watch: {
    value(value) {
      this.formattedValue =
        typeof value === "number"
          ? value.toLocaleString(this.locale, {
              minimumFractionDigits: this.decimalLength,
              maximumFractionDigits: this.decimalLength
            })
          : null;
    }
  },
  mounted() {
    this.$refs.textfield.resetValidation();
    dispatchEvent(this.$el.querySelector("input"), "defaultValue");
  },
  computed: {
    attrs() {
      // eslint-disable-next-line
      const { value, ...attrs } = this.$attrs; // all but input event
      return attrs;
    },
    distractionFree() {
      if (this.decimalLength > 0) {
        return !this.autoDecimalMode;
      } else {
        return false;
      }
    },
    decimalMode() {
      if (this.decimalLength > 0) {
        return this.autoDecimalMode;
      } else {
        return false;
      }
    },
    valueRange() {
      if (this.min || this.max) {
        return { min: this.min, max: this.max };
      } else {
        return undefined;
      }
    }
  },
  methods: {
    listeners() {
      // eslint-disable-next-line
      const { input, ...listeners } = this.$listeners; // all but input event
      return {
        ...listeners,
        defaultValue: () => {
          let input = this.$el.querySelector("input");

          if (
            !this.value &&
            this.defaultValue !== null &&
            this.defaultValue !== undefined &&
            !input.$ci.focus
          ) {
            input.$ci.numberValue =
              this.valueAsInteger && this.defaultValue
                ? this.defaultValue * Math.pow(10, this.decimalLength)
                : this.defaultValue;
            dispatchEvent(input, "blur");
          }
        },
        input: () => {
          let input = this.$el.querySelector("input");

          if (
            (input.$ci.numberValue == null ||
              input.$ci.numberValue == undefined) &&
            this.defaultValue !== null &&
            !input.$ci.focus
          ) {
            input.$ci.numberValue = this.defaultValue;
            dispatchEvent(input, "blur");
          }

          if (input.$ci && this.value !== input.$ci.numberValue) {
            this.$emit(
              "input",
              toInteger(
                input.$ci.numberValue,
                this.valueAsInteger,
                this.decimalLength
              )
            );
          }

          this.formattedValue = input.value;
        },
        keyup: event => {
          if (event.key === "-" || event.key === "+") {
            let {
              value,
              negative
            } = stripCurrencySymbolAndMinusSign(
              this.$el.querySelector("input").value,
              { prefix: "", suffix: "" }
            );
            const numberParts = value.split(
              this.$el.querySelector("input").$ci.currencyFormat.decimalSymbol
            );
            let parsedValue = parse(
              value,
              this.$el.querySelector("input").$ci.currencyFormat
            );
            let stringValue = null;
            if (numberParts.length === 2) {
              const fraction = numberParts[1];
              stringValue = new Intl.NumberFormat(this.locale, {
                minimumFractionDigits: fraction.length,
                maximumFractionDigits: fraction.length
              }).format(parsedValue);
            }

            let numberValue = stringValue || parsedValue;
            if (event.key === "-" && !negative && numberValue !== null) {
              this.$el.querySelector("input").value = `-${numberValue}`;
              dispatchEvent(this.$el.querySelector("input"), "input");
            }

            if (event.key === "+" && negative && numberValue !== null) {
              this.$el.querySelector("input").value = `${numberValue}`;
              dispatchEvent(this.$el.querySelector("input"), "input");
            }
          }
        }
      };
    }
  }
};
</script>