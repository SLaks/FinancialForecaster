<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th></th>
          <th class="text-left">Date</th>
          <th class="text-left">Name</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(transaction, index) in transactions"
          :key="index"
          :class="colorClass(transaction)"
        >
          <td>
            <v-icon :class="colorClass(transaction)">mdi-arrow-{{transaction.amount > 0 ? 'up' : 'down'}}-drop-circle-outline</v-icon>
          </td>
          <td :title="transaction.date | formatDateLong">{{transaction.date | formatDate}}</td>
          <td>{{transaction.name}}</td>
          <td class="text-right">{{transaction.amount | currency }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Transaction } from "../schema";
import { format } from "date-fns";
import Vue2Filters from "vue2-filters";

@Component({
  filters: {
    formatDate: (date: Date) => format(date, "yyyy-MM-dd"),
    formatDateLong: (date: Date) => format(date, "iiii, MMMM d, yyyy")
  },
  mixins: [Vue2Filters.mixin]
})
export default class TransactionsTable extends Vue {
  @Prop()
  private transactions!: Transaction[];

  colorClass(transaction: Transaction) {
    return transaction.amount > 0 ? "green--text" : "red--text";
  }
}
</script>

<style lang="sass" scoped>

</style>