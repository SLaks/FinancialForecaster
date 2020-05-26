<template>
  <div>
    <DatePicker label="Start Date" v-model="mortgageInfo.startDate" />
    <currency-field
      currency="USD"
      label="Loan Amount"
      v-model.number="mortgageInfo.loanAmount"
    />
    <v-combobox label="Term" type="tel" v-model.number="mortgageInfo.term" :items="[15,20,30]" />
    <currency-field label="Down Payment" v-model.number="mortgageInfo.downPayment" />
    <currency-field
      label="Rate"
      :currency="{suffix: '%'}"
      :precision="3"
      :min=".1"
      v-model.number="mortgageInfo.rate"
    />
    <v-select
      label="Period"
      v-model="mortgageInfo.period"
      :items="[
          {text: 'Monthly', value: 'monthly'},
          {text: 'Bi-weekly', value: 'biweekly'}
        ]"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CurrencyField from "./widgets/CurrencyField.vue";
import DatePicker from "./widgets/DatePicker.vue";
import { MortgageInfo } from "@/schema";
import equal from "fast-deep-equal";

@Component({
  components: { DatePicker, CurrencyField }
})
export default class MortgageSettingsUI extends Vue {
  @Prop() value!: MortgageInfo;

  mortgageInfo = { ...this.value };

  @Watch("value")
  updateData(value: MortgageInfo) {
    this.mortgageInfo = { ...value };
  }
  @Watch("mortgageInfo", { deep: true })
  updateParent(value: MortgageInfo) {
    if (!equal(value, this.value)) this.$emit("input", value);
  }
}
</script>