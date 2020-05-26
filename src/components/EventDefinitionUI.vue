<template>
  <tr class="EventDefinitionRow">
    <td>
      <v-text-field dense v-model="def.name" placeholder="Name" />
    </td>
    <td style="width: 128px;">
      <CurrencyField dense v-model="def.amount" />
    </td>
    <td style="width: 144px;">
      <DatePicker dense v-model="def.startDate" />
    </td>
    <td>{{periodDescription}} {{untilDescription}}</td>
    <td>
      <v-btn icon small @click="$emit('delete')" title="Delete event">
        <v-icon small>mdi-delete</v-icon>
      </v-btn>
    </td>
  </tr>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CurrencyField from "./widgets/CurrencyField.vue";
import DatePicker from "./widgets/DatePicker.vue";
import { EventDefinition } from "@/schema";
import equal from "fast-deep-equal";
import ordinal from "ordinal";
import { format } from "date-fns";

@Component({
  components: { DatePicker, CurrencyField }
})
export default class EventDefinitionUI extends Vue {
  @Prop() value!: EventDefinition;

  def = { ...this.value };
  readonly weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Saturday"
  ];

  get periodDescription() {
    switch (this.def.period) {
      case "months":
        let str;
        if (this.def.periodCount === 1) str = "Every month";
        else str = `Every ${this.def.periodCount} months`;
        return `${str} on the ${ordinal(this.def.periodSubIndex + 1)}`;

      case "weeks":
        const day = this.weekdays[this.def.periodSubIndex];
        if (this.def.periodCount === 1) return `Every ${day}`;
        else return `Every ${this.def.periodCount} ${day}s`;
    }
  }

  get untilDescription() {
    if (!this.def.endDate) return null;
    return `Until ${format(this.def.endDate, "MM/dd/yyyy")}`;
  }

  get pluralizedPeriod() {
    if (this.def.periodCount === 1) return this.def.period.replace(/s$/, "");
    return this.def.period;
  }

  hover = false;

  @Watch("value")
  updateData(value: EventDefinition) {
    this.def = { ...value };
  }
  @Watch("def", { deep: true })
  updateParent(value: EventDefinition) {
    if (!equal(value, this.value)) this.$emit("input", value);
  }
}
</script>

<style lang="scss">
.EventDefinitionRow:not(:hover)
  .v-text-field
  > .v-input__control
  > .v-input__slot::before {
  display: none;
}
</style>