<template>
  <div class="Root">
    <div class="DefinitionTabs">
      <v-tabs v-model="settingsTab" background-color="primary" dark>
        <v-tab>Bank Accounts</v-tab>
        <v-tab>Mortgage</v-tab>
        <v-tab>Payments / Income</v-tab>
      </v-tabs>

      <v-tabs-items v-model="settingsTab">
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <BankSettingsUI v-model="bankInfo" />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <MortgageSettingsUI v-model="mortgageInfo" />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-simple-table dense fixed-header :height="400">
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Amount</th>
                    <th class="text-left">Start Date</th>
                    <th class="text-left">Recurrence</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(def, index) in events"
                    :key="def.id"
                    is="EventDefinitionUI"
                    @delete="events.splice(index, 1)"
                    :value="def"
                    @input="Object.assign(def, $event)"
                  />
                </tbody>
              </v-simple-table>
              <v-btn block text @click="addEvent">Add event</v-btn>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </div>

    <div class="Results">
      <v-tabs v-model="resultsTab" background-color="primary" dark>
        <v-tab>Transactions</v-tab>
        <v-tab>Balances</v-tab>
      </v-tabs>
      <v-tabs-items v-model="resultsTab">
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <transactions-table :transactions="transactions" />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <records-table :records="bankRecords" />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>

      <GChart type="LineChart" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { addYears } from "date-fns";
import { deserializeWithDates } from "../utils";
import {
  generateMortgage,
  generateEventTransactions,
  generateBankRecords
} from "../logic";
import { MortgageInfo, EventDefinition, BankInfo } from "../schema";
import sortBy from "lodash/sortBy";

import BankSettingsUI from "./BankSettingsUI.vue";
import EventDefinitionUI from "./EventDefinitionUI.vue";
import MortgageSettingsUI from "./MortgageSettingsUI.vue";
import RecordsTable from "./RecordsTable.vue";
import TransactionsTable from "./TransactionsTable.vue";

interface UrlState {
  mortgageInfo: MortgageInfo;
  bankInfo: BankInfo;
  events: EventDefinition[];
  settingsTab: string | null;
}

@Component({
  components: {
    EventDefinitionUI,
    MortgageSettingsUI,
    RecordsTable,
    TransactionsTable,
    BankSettingsUI
  }
})
export default class Home extends Vue {
  private mortgageInfo = new MortgageInfo();
  private bankInfo = new BankInfo();
  private events: EventDefinition[] = [];
  private settingsTab = null;
  private resultsTab = null;

  addEvent() {
    const newEvent = new EventDefinition();
    while (this.events.some(ev => ev.id === newEvent.id)) newEvent.id++;
    this.events.push(newEvent);
  }

  mounted() {
    window.onhashchange = () => this.parseHash();
    if (!location.hash) return;
    this.parseHash();
  }
  parseHash() {
    const urlState = deserializeWithDates(
      decodeURIComponent(location.hash.replace(/^#/, ""))
    ) as UrlState;
    if (!urlState) return;
    const urlKeys: Array<keyof UrlState> = [
      "bankInfo",
      "mortgageInfo",
      "events",
      "settingsTab"
    ];
    for (const key of urlKeys) {
      if (urlState[key]) {
        if (typeof this[key] === "object") {
          Object.assign(this[key], urlState[key]);
        } else {
          (this as any)[key] = urlState[key];
        }
      }
    }
  }

  get urlState(): UrlState {
    return {
      bankInfo: this.bankInfo,
      mortgageInfo: this.mortgageInfo,
      events: this.events,
      settingsTab: this.settingsTab
    };
  }

  @Watch("urlState", { deep: true })
  saveState(val: UrlState) {
    if (!val) return;
    location.replace("#" + JSON.stringify(val));
  }

  get endDate() {
    return addYears(this.bankInfo.asOfDate, 30);
  }

  get transactions() {
    const all = [
      ...generateMortgage(this.mortgageInfo),
      ...this.events.flatMap(e => generateEventTransactions(e, this.endDate))
    ];
    return sortBy(all, "date");
  }

  get bankRecords() {
    return generateBankRecords(this.bankInfo, this.endDate, this.transactions);
  }

  chartOptions = { focusTarget: "category" };

  get chartData() {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD"
    });
    return [
      ["Date", "Checking", "Savings"],
      ...this.bankRecords
        .filter(b => b.date.getDate() === 0 || b.date.getDate() === 15)
        .map(b => [
          b.date,
          { v: b.checkingBalance, f: formatter.format(b.checkingBalance) },
          { v: b.savingsBalance, f: formatter.format(b.savingsBalance) }
        ])
    ];
  }
}
</script>

<style lang="scss" scoped>
.Root {
  display: flex;

  @media (max-width: 800px) {
    flex-wrap: wrap;
  }

  .DefinitionTabs {
    min-width: 600px;
    flex-grow: .2;
  }

  .Results {
    flex-grow: 20000;
    min-width: 400px;
  }
}
</style>