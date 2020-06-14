<template>
  <div class="Root pa-4">
    <div class="Column Left">
      <v-card class="DefinitionTabs" elevation="4">
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
                <v-simple-table dense>
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
      </v-card>
    </div>

    <div class="Column Right">
      <v-card elevation="4" class="ScrollableCard">
        <v-card-text>
          <records-table :records="bankRecords" />
        </v-card-text>
      </v-card>

      <v-card elevation="4" class="overflow-hidden Chart">
        <GChart type="LineChart" :data="chartData" :options="chartOptions" />
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { google } from "../shims-google";
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
    BankSettingsUI
  }
})
export default class Home extends Vue {
  private mortgageInfo = new MortgageInfo();
  private bankInfo = new BankInfo();
  private events: EventDefinition[] = [];
  private settingsTab = null;

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

  chartOptions: google.visualization.LineChartOptions = {
    focusTarget: "category",
    vAxis: { format: "currency" },
    series: [{ targetAxisIndex: 0 }, { targetAxisIndex: 1 }],
    height: 300,
    vAxes: [{ title: "Checking" }, { title: "Savings" }]
  };

  get chartData() {
    const currency = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD"
    });
    return [
      ["Date", "Checking", "Savings", "Incomes", "Expenses"],
      ...this.bankRecords.map(b => [
        b.startOfMonth,
        { v: b.checkingBalance, f: currency.format(b.checkingBalance) },
        { v: b.savingsBalance, f: currency.format(b.savingsBalance) },
        { v: b.income, f: currency.format(b.income) },
        { v: b.expenses, f: currency.format(b.expenses) }
      ])
    ];
  }
}
</script>

<style lang="scss" scoped>
@import "../variables";

.Root {
  @media (max-width: $largeWidth) {
    .Column > .v-card {
      margin-bottom: 16px;
    }
  }

  @media (min-width: $largeWidth + 1) {
    display: flex;
    overflow: hidden;
    min-height: 0;

    .Column {
      display: flex;
      flex-direction: column;
      > .v-card + .v-card {
        margin-top: 16px;
      }
      &.Left {
        margin-right: 16px;
        min-width: 600px;
        flex-grow: 0.2;
      }
      &.Right {
        flex-grow: 20000;
        min-width: 500px;
      }
    }

    .Chart {
      flex-shrink: 0;
    }

    // Force content to scroll vertically.
    .ScrollableCard {
      display: flex;
      overflow: hidden;
      flex-direction: column;
      > .v-card__text {
        display: flex;
        overflow: hidden;
      }
    }
  }
}

.overflow-hidden {
  overflow: hidden;
}
</style>