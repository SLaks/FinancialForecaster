<template>
  <div class="home">
    <div class="Form">
      <DatePicker label="Start Date" type="date" v-model="startDate" />
      <v-text-field label="Loan Amount" type="number" v-model.number="mortgageInfo.loanAmount" />
      <v-combobox
        label="Term"
        type="number"
        v-model.number="mortgageInfo.term"
        :items="[15,20,30]"
      />
      <v-text-field label="Down Payment" type="number" v-model.number="mortgageInfo.downPayment" />
      <v-text-field label="Rate (%)" type="number" v-model.number="mortgageInfo.rate" />
      <v-select
        label="Period"
        v-model="mortgageInfo.period"
        :items="[
        {text: 'Monthly', value: 'monthly'},
        {text: 'Bi-weekly', value: 'biweekly'}
      ]"
      />
    </div>

    <transactions-table :transactions="transactions" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { MortgageInfo, EventDefinition } from "../schema";
import { generateMortgage } from "../logic";

import TransactionsTable from "./TransactionsTable.vue";
import DatePicker from "./widgets/DatePicker.vue";
import { formatISO, startOfDay, parseISO } from "date-fns";

interface UrlState {
  startDate: string | null;
  mortgageInfo: MortgageInfo;
  events: EventDefinition[];
}

@Component({
  components: { DatePicker, TransactionsTable }
})
export default class Home extends Vue {
  private mortgageInfo = new MortgageInfo();
  private startDate: Date = startOfDay(new Date());
  private events: EventDefinition[] = [];

  mounted() {
    if (!location.hash) return;
    const urlState = JSON.parse(
      decodeURIComponent(location.hash.replace(/^#/, ""))
    ) as UrlState;
    if (!urlState) return;
    if (urlState.startDate) this.startDate = parseISO(urlState.startDate);
    if (urlState.mortgageInfo) this.mortgageInfo = urlState.mortgageInfo;
    if (urlState.events) this.events = urlState.events;
  }

  get urlState(): UrlState {
    return {
      mortgageInfo: { ...this.mortgageInfo },
      events: this.events,
      startDate: formatISO(this.startDate, {representation: 'date'})
    };
  }

  @Watch("urlState")
  saveState(val: UrlState) {
    if (!val) return;
    location.replace("#" + JSON.stringify(val));
  }

  get transactions() {
    return generateMortgage(this.startDate, this.mortgageInfo);
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
