<template>
  <v-menu
    ref="menu"
    v-model="menuOpen"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    offset-overflow
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="formattedDate"
        :label="label"
        :hint="hint"
        persistent-hint
        prepend-icon="mdi-calendar"
        @keydown.esc="menuOpen = false;"
        v-on="on"
      />
    </template>
    <v-date-picker :value="value && value.toISOString()" @input="setDate($event)" no-title />
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { format, parseISO, parse } from "date-fns";

const formatStr = "MM/dd/yyyy";
@Component({})
export default class DatePicker extends Vue {
  menuOpen = false;

  @Prop() label!: string;
  @Prop() hint!: string;
  @Prop() value!: Date;

  get formattedDate() {
    return format(coerceDate(this.value), formatStr);
  }
  set formattedDate(value: string) {
    this.$emit("input", new Date(value));
  }

  setDate(value: Date | string) {
    this.menuOpen = false;
    this.$emit("input", coerceDate(value));
  }
}

function coerceDate(value: string | Date): Date {
  return value instanceof Date ? value : parseISO(value);
}
</script>