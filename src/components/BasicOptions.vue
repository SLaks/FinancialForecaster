<template>
  <div class="Form">
    <label>
      <span>Loan Amount</span>
      <input type="number" v-model="loanAmount" />
    </label>
    <label>
      <span>Term</span>
      <input type="number" v-model="term" />
    </label>
    <label>
      <span>Down Payment</span>
      <input type="number" v-model="downPayment" />
    </label>
    <label>
      <span>Rate</span>
      <input type="number" v-model="rate" />
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class BasicOptions extends Vue {
  @Prop() loanAmount!: number;
  @Prop() term!: number;
  @Prop() downPayment!: number;
  @Prop() rate!: number;
  @Prop() period!: "monthly" | "biweekly";
}
</script>

<style scoped lang="scss">
.Form {
  label {
    display: flex;
    margin-bottom: 8px;
    span {
        width: 160px;
    }
  }
}
</style>