<template>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Name</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tr v-for="(transaction, index) in transactions" :key="index">
      <td>{{transaction.date | formatDate}}</td>
      <td>{{transaction.name}}</td>
      <td>{{transaction.amount | currency }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Transaction } from "../schema";
import { format } from "date-fns";
import Vue2Filters from "vue2-filters";

@Component({
  filters: {
    formatDate: (date: Date) => format(date, "yyyy-MM-dd")
  },
  mixins: [Vue2Filters.mixin]
})
export default class TransactionsTable extends Vue {
  @Prop()
  private transactions!: Transaction[];
}
</script>

<style lang="sass" scoped>

</style>