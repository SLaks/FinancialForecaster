<template>
  <div class="home">
    <v-card>
      <v-tabs v-model="settingsTab" background-color="primary" dark>
        <v-tab>Mortgage</v-tab>
        <v-tab>Payments / Income</v-tab>
      </v-tabs>

      <v-tabs-items v-model="settingsTab">
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
              <v-simple-table dense fixed-header :height="600">
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

    <transactions-table :transactions="transactions" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { deserializeWithDates } from "../utils";
import { generateMortgage } from "../logic";
import { MortgageInfo, EventDefinition } from "../schema";

import EventDefinitionUI from "./EventDefinitionUI.vue";
import MortgageSettingsUI from "./MortgageSettingsUI.vue";
import TransactionsTable from "./TransactionsTable.vue";

interface UrlState {
  mortgageInfo: MortgageInfo;
  events: EventDefinition[];
  settingsTab: string|null;
}

@Component({
  components: { EventDefinitionUI, MortgageSettingsUI, TransactionsTable }
})
export default class Home extends Vue {
  private mortgageInfo = new MortgageInfo();
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
      "mortgageInfo",
      "events",
      "settingsTab"
    ];
    for (const key of urlKeys) {
      if (urlState[key]) (this as any)[key] = urlState[key];
    }
  }

  get urlState(): UrlState {
    return {
      mortgageInfo: this.mortgageInfo,
      events: this.events,
      settingsTab: this.settingsTab, 
    };
  }

  @Watch("urlState", { deep: true })
  saveState(val: UrlState) {
    if (!val) return;
    location.replace("#" + JSON.stringify(val));
  }

  get transactions() {
    return generateMortgage(this.mortgageInfo);
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
