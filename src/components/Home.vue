<template>
  <div class="home">
    <div class="Form">
      <label>
        <span>Start Date</span>
        <input type="date" v-model="startDate" />
      </label>
      <label>
        <span>Loan Amount</span>
        <input type="number" v-model="mortgageInfo.loanAmount" />
      </label>
      <label>
        <span>Term</span>
        <input type="number" v-model="mortgageInfo.term" />
      </label>
      <label>
        <span>Down Payment</span>
        <input type="number" v-model="mortgageInfo.downPayment" />
      </label>
      <label>
        <span>Rate (%)</span>
        <input type="number" v-model="mortgageInfo.rate" />
      </label>
      <label>
        <span>Period</span>
        <select v-model="mortgageInfo.period">
          <option value="monthly">Monthly</option>
          <option value="biweekly">Bi-weekly</option>
        </select>
      </label>
    </div>

    <transactions-table :transactions="transactions" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { MortgageInfo, EventDefinition } from "../schema";
import { generateMortgage } from "../logic";

import TransactionsTable from "./TransactionsTable.vue";
import { format } from "date-fns";

interface UrlState {
  startDate: string | null;
  mortgageInfo: MortgageInfo;
  events: EventDefinition[];
}

@Component({
  components: { TransactionsTable }
})
export default class Home extends Vue {
  private mortgageInfo = new MortgageInfo();
  private startDate: string = "";
  private events: EventDefinition[] = [];

  mounted() {
    if (!location.hash) return;
    const urlState = JSON.parse(
      decodeURIComponent(location.hash.replace(/^#/, ""))
    ) as UrlState;
    if (!urlState) return;
    if (urlState.startDate) this.startDate = urlState.startDate;
    if (urlState.mortgageInfo) this.mortgageInfo = urlState.mortgageInfo;
    if (urlState.events) this.events = urlState.events;
  }

  get urlState(): UrlState {
    return {
      mortgageInfo: { ...this.mortgageInfo },
      events: this.events,
      startDate: this.startDate
        ? format(new Date(this.startDate), "yyyy-MM-dd")
        : null
    };
  }

  @Watch("urlState")
  saveState(val: UrlState) {
    location.replace("#" + JSON.stringify(val));
  }

  get transactions() {
    return generateMortgage(new Date(this.startDate), this.mortgageInfo);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Form {
  label {
    display: flex;
    margin-bottom: 8px;
    span {
      width: 160px;
    }
    input {
      width: 128px;
    }
  }
}
</style>
