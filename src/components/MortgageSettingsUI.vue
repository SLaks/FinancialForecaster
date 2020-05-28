<template>
  <div>
    <DatePicker label="Start Date" v-model="mortgageInfo.startDate" />
    <v-combobox label="Term" type="tel" v-model.number="mortgageInfo.term" :items="[15,20,30]" />
    <div class="Row">
      <currency-field label="House Price" v-model.number="mortgageInfo.housePrice" />
      <currency-field
        currency="USD"
        label="Loan Amount"
        v-model.lazy.number="mortgageInfo.loanAmount"
      />
    </div>
    <div class="Row">
      <currency-field
        label="Percent Down"
        v-model.number="downPercent"
        :currency="{suffix: '%'}"
        :precision="3"
      />
      <currency-field label="Down Payment" v-model.lazy.number="downPayment" />
    </div>
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

<style lang="scss" scoped>
.Row {
  display: flex;
  > :first-child {
    margin-right: 16px;
  }
}
</style>

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

  get downPayment() {
    return this.mortgageInfo.housePrice - this.mortgageInfo.loanAmount;
  }
  set downPayment(value) {
    this.mortgageInfo.loanAmount = this.mortgageInfo.housePrice - value;
  }

  get downPercent() {
    return (
      (1 - this.mortgageInfo.loanAmount / this.mortgageInfo.housePrice) * 100
    );
  }
  set downPercent(value) {
    value /= 100;
    this.mortgageInfo.loanAmount = this.mortgageInfo.housePrice * (1 - value);
  }

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