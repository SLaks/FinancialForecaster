<template>
  <tr class="EventDefinitionRow">
    <td>
      <v-text-field dense v-model="def.name" placeholder="Name" />
    </td>
    <td>
      <CurrencyField dense v-model="def.amount" style="width:96px;" />
    </td>
    <td>
      <DatePicker dense v-model="def.startDate" />
    </td>
    <td>Recur?</td>
    <td>
      <v-btn icon small @click="$emit('delete')"  title="Delete event">
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

@Component({
  components: { DatePicker, CurrencyField }
})
export default class EventDefinitionUI extends Vue {
  @Prop() value!: EventDefinition;

  def = { ...this.value };

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