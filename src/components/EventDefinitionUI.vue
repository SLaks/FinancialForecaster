<template>
  <tr class="EventDefinitionRow">
    <td>
      <v-text-field dense hide-details :color="color" v-model="def.name" placeholder="Name">
        <template v-slot:prepend>
          <v-icon
            :class="colorClass"
          >mdi-arrow-{{def.amount > 0 ? 'up' : 'down'}}-drop-circle-outline</v-icon>
        </template>
      </v-text-field>
    </td>
    <td style="width: 128px;">
      <CurrencyField dense hide-details :color="color" v-model="def.amount" :allowNegative="true" />
    </td>
    <td style="width: 144px;">
      <DatePicker dense hide-details small-icon :color="color" v-model="def.startDate" />
    </td>
    <td>
      <v-menu offset-y transition="slide-x-transition" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-btn :class="[colorClass, 'RecurButton']" small v-on="on" text>
            <span class="RecurLabel">{{periodDescription}} {{untilDescription}}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-switch :label="recurs ? 'Recur' : 'Once'" v-model="recurs" />
          </v-list-item>
          <v-list-item v-if="recurs">
            <v-text-field label="Every" :min="1" v-model.number="def.periodCount" type="number" />
          </v-list-item>
          <v-list-item v-if="recurs">
            <v-select
              v-model="def.period"
              :items="[
                {text: pluralize('Month'), value: 'months'},
                {text: pluralize('Week'), value: 'weeks'}
                ]"
            />
          </v-list-item>
          <v-list-item v-if="recurs">
            <DatePicker label="Until" clearable v-model="def.endDate" />
          </v-list-item>
        </v-list>
      </v-menu>
    </td>
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

const dayOfWeekFormat = new Intl.DateTimeFormat(undefined, { weekday: "long" });
@Component({
  components: { DatePicker, CurrencyField }
})
export default class EventDefinitionUI extends Vue {
  @Prop() value!: EventDefinition;

  def = { ...this.value };
  pluralize(str: string) {
    return str + (this.def.periodCount === 1 ? "" : "s");
  }

  get color() {
    if (this.def.amount > 0) return "green";
    if (this.def.amount < 0) return "red";
    return null;
  }
  get colorClass() {
    return this.color ? this.color + "--text" : null;
  }

  get recurs() {
    return this.def.period !== "once";
  }
  set recurs(value: boolean) {
    this.def.period = value ? "months" : "once";
  }

  get periodDescription() {
    switch (this.def.period) {
      case "months":
        let str;
        if (this.def.periodCount === 1) str = "Every month";
        else str = `Every ${this.def.periodCount} months`;
        return `${str} on the ${ordinal(this.def.startDate.getDate())}`;

      case "weeks":
        var day = dayOfWeekFormat.format(this.def.startDate);

        if (this.def.periodCount === 1) return `Every ${day}`;
        else return `Every ${this.def.periodCount} ${day}s`;
      case "once":
        return "Once";
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

.RecurButton {
  overflow: hidden;
  white-space: normal !important;
  height: auto !important;
  display: block !important;
  margin: 4px;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  text-align: left;
  .RecurLabel {
    display: block;
  }
}
</style>