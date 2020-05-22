<template>
  <div class="home">
    <div class="Form">
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { MortgageInfo, EventDefinition } from "../schema";

interface UrlState {
  mortgageInfo: MortgageInfo;
  events: EventDefinition[];
}

@Component({
  components: {}
})
export default class Home extends Vue {
  private mortgageInfo = new MortgageInfo();
  private events: EventDefinition[] = [];

  mounted() {
    if (!location.hash) return;
    const urlState = JSON.parse(
      decodeURIComponent(location.hash.replace(/^#/, ""))
    ) as UrlState;
    if (!urlState) return;
    if (urlState.mortgageInfo) this.mortgageInfo = urlState.mortgageInfo;
    if (urlState.events) this.events = urlState.events;
  }

  get urlState(): UrlState {
    return { mortgageInfo: { ...this.mortgageInfo }, events: this.events };
  }

  @Watch("urlState")
  saveState(val: UrlState) {
    location.replace("#" + JSON.stringify(val));
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
      width: 64px;
    }
  }
}
</style>
