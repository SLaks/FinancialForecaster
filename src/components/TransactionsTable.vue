<template>
  <v-simple-table :dense="true" :fixed-header="true" :height="600">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Date</th>
          <th class="text-left">Name</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaction, index) in transactions" :key="index">
          <td>{{transaction.date | formatDate}}</td>
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