<template>
  <div class="home">
    <MortgageSettingsUI v-model="mortgageInfo" />

    <transactions-table :transactions="transactions" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { MortgageInfo, EventDefinition } from "../schema";
import { generateMortgage } from "../logic";

import MortgageSettingsUI from "./MortgageSettingsUI.vue";
import TransactionsTable from "./TransactionsTable.vue";
import { formatISO, parseISO } from "date-fns";

interface UrlState {
  mortgageInfo: Omit<MortgageInfo, "startDate"> & { startDate: string };
  events: EventDefinition[];
}

@Component({
  components: { MortgageSettingsUI, TransactionsTable }
})
export default class Home extends Vue {
  private mortgageInfo = new MortgageInfo();
  private events: EventDefinition[] = [];

  mounted() {
    window.onhashchange = () => this.parseHash();
    if (!location.hash) return;
    this.parseHash();
  }
  parseHash() {
    const urlState = JSON.parse(
      decodeURIComponent(location.hash.replace(/^#/, ""))
    ) as UrlState;
    if (!urlState) return;
    if (urlState.mortgageInfo)
      this.mortgageInfo = {
        ...urlState.mortgageInfo,
        startDate: urlState.mortgageInfo.startDate
          ? parseISO(urlState.mortgageInfo.startDate)
          : new Date()
      };
    if (urlState.events) this.events = urlState.events;
  }

  get urlState(): UrlState {
    return {
      mortgageInfo: {
        ...this.mortgageInfo,
        startDate: formatISO(this.mortgageInfo.startDate, {
          representation: "date"
        })
      },
      events: this.events
    };
  }

  @Watch("urlState")
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
