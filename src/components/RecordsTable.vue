<template>
  <v-data-table
    dense
    :items-per-page="12"
    :headers="headers"
    :items="records"
    item-key="key"
    show-expand
    :expanded.sync="expandedRows"
    fixed-header
    single-expand
    disable-sort
    class="RecordsTable"
  >
    <template v-slot:item.startOfMonth="{ item }">
      <span class="text-no-wrap">{{item.startOfMonth | formatMonth}}</span>
    </template>
    <template v-slot:item.checkingBalance="{ item }">{{item.checkingBalance | currency }}</template>
    <template v-slot:item.savingsBalance="{ item }">{{item.savingsBalance | currency }}</template>
    <template v-slot:item.income="{ item }">
      <span class="green--text">{{item.income | currency }}</span>
    </template>
    <template v-slot:item.expenses="{ item }">
      <span class="red--text">{{item.expenses | currency }}</span>
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length" class="ExpandedCell pb-5">
        <v-card>
          <transactions-table :transactions="item.transactions" />
        </v-card>
      </td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { BankRecord } from "../schema";
import { format } from "date-fns";
import Vue2Filters from "vue2-filters";
import TransactionsTable from "./TransactionsTable.vue";

@Component({
  components: { TransactionsTable },
  filters: {
    formatMonth: (date: Date) => format(date, "yyyy: MMMM")
  },
  mixins: [Vue2Filters.mixin]
})
export default class RecordsTable extends Vue {
  @Prop()
  private records!: BankRecord[];

  expandedRows = [];

  headers = [
    { text: "", value: "data-table-expand" },
    { text: "Date", value: "startOfMonth" },
    { text: "Checking", value: "checkingBalance", align: "end" },
    { text: "Savings", value: "savingsBalance", align: "end" },
    { text: "Income", value: "income", align: "end" },
    { text: "Expenses", value: "expenses", align: "end" }
  ];
}
</script>

<style lang="scss">
// Force table to scroll vertically.
.RecordsTable {
  display: flex;
  flex-direction: column;
  max-height: 100%;
}

.RecordsTable tbody tr:not(.v-data-table__expanded__content) > td:first-child {
  padding: 0 0 0 8px;
}

// Prevent a scrollbar when collapsed (from the focus circle).
.RecordsTable tbody tr:not(.v-data-table__expanded__content):last-child .v-icon {
  overflow: hidden;
}
.RecordsTable tbody tr.v-data-table__expanded__content {
  box-shadow: none !important;
}
</style>