<template>
  <div>
    <DatePicker label="Starting balances as of" v-model="bankInfo.asOfDate" />

    <v-card>
      <v-card-title>Checking account</v-card-title>

      <v-card-text>
        <div class="Row">
          <currency-field :label="asOfLabel" v-model.number="bankInfo.checkingBalance" />
          <currency-field
            label="APR"
            v-model.number="bankInfo.checkingGrowthRate"
            :currency="{suffix: '%'}"
            :precision="3"
          />
        </div>
      </v-card-text>
      <v-divider />
      <v-card-text>
        <currency-field
          label="Target balance"
          hint="Any excess value will be deposited to savings monthly."
          v-model.number="bankInfo.checkingTarget"
        />
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>Savings account</v-card-title>

      <v-card-text>
        <div class="Row">
          <currency-field :label="asOfLabel" v-model.number="bankInfo.savingsBalance" />
          <currency-field
            label="APR"
            v-model.number="bankInfo.savingsGrowthRate"
            :currency="{suffix: '%'}"
            :precision="3"
          />
        </div>
      </v-card-text>
    </v-card>
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
import { BankInfo } from "@/schema";
import equal from "fast-deep-equal";
import { format } from "date-fns";

@Component({
  components: { DatePicker, CurrencyField }
})
export default class BankSettingsUI extends Vue {
  @Prop() value!: BankInfo;

  bankInfo = { ...this.value };

  get asOfLabel() {
    return `Value as of ${format(this.bankInfo.asOfDate, "M/d/yyyy")}`;
  }

  @Watch("value")
  updateData(value: BankInfo) {
    this.bankInfo = { ...value };
  }
  @Watch("bankInfo", { deep: true })
  updateParent(value: BankInfo) {
    if (!equal(value, this.value)) this.$emit("input", value);
  }
}
</script>