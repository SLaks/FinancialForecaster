<template>
  <div class="home">
    <div class="Form">
      <label>
        <span>Loan Amount</span>
        <input type="number" v-model="basicOptions.loanAmount" />
      </label>
      <label>
        <span>Term</span>
        <input type="number" v-model="basicOptions.term" />
      </label>
      <label>
        <span>Down Payment</span>
        <input type="number" v-model="basicOptions.downPayment" />
      </label>
      <label>
        <span>Rate</span>
        <input type="number" v-model="basicOptions.rate" />
      </label>
      <label>
        <span>Period</span>
        <select v-model="basicOptions.period">
          <option value="monthly">Monthly</option>
          <option value="biweekly">Bi-weekly</option>
        </select>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { BasicOptionsType, EventDefinition } from "../schema";

interface UrlState {
  basicOptions: BasicOptionsType;
  events: EventDefinition[];
}

@Component({
  components: {}
})
export default class Home extends Vue {
  private basicOptions = new BasicOptionsType();
  private events: EventDefinition[] = [];

  mounted() {
    if (!location.hash) return;
    const urlState = JSON.parse(
      decodeURIComponent(location.hash.replace(/^#/, ""))
    ) as UrlState;
    if (!urlState) return;
    if (urlState.basicOptions) this.basicOptions = urlState.basicOptions;
    if (urlState.events) this.events = urlState.events;
  }

  get urlState(): UrlState {
    return { basicOptions: { ...this.basicOptions }, events: this.events };
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
