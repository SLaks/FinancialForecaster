<template>
  <v-simple-table :dense="true" :fixed-header="true" :height="600">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Date</th>
          <th class="text-right">Checking</th>
          <th class="text-right">Savings</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in filteredRecords" :key="index">
          <td :title="record.date | formatDateLong">{{record.date | formatDate}}</td>
          <td class="text-right">{{record.checkingBalance | currency }}</td>
          <td class="text-right">{{record.savingsBalance | currency }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { BankRecord } from "../schema";
import { format } from "date-fns";
import Vue2Filters from "vue2-filters";

@Component({
  filters: {
    formatDate: (date: Date) => format(date, "yyyy-MM-dd"),
    formatDateLong: (date: Date) => format(date, "iiii, MMMM d, yyyy")
  },
  mixins: [Vue2Filters.mixin]
})
export default class RecordsTable extends Vue {
  @Prop()
  private records!: BankRecord[];

  get filteredRecords() {
    return this.records.filter((r, i) => {
      if (!i) return true;
      const last = this.records[i - 1];
      return (
        r.checkingBalance !== last.checkingBalance ||
        r.savingsBalance !== last.savingsBalance
      );
    });
  }
}
</script>

<style lang="sass" scoped>

</style>