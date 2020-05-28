<template>
  <v-menu
    ref="menu"
    v-model="menuOpen"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    offset-overflow
    max-width="96px"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="formattedDate"
        v-bind="$attrs"
        persistent-hint
        @keydown.esc="menuOpen = false;"
        v-on="on"
      >
        <template v-slot:append>
          <v-btn @click="menuOpen = !menuOpen;" icon x-small tabindex="-1">
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </template>
    <v-date-picker :value="isoDate" @input="setDate($event)" no-title />
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { format, formatISO, parseISO, parse } from "date-fns";

const formatStr = "MM/dd/yyyy";
@Component({})
export default class DatePicker extends Vue {
  menuOpen = false;

  @Prop() value!: Date;

  get formattedDate() {
    if (!this.value) return null;
    return format(coerceDate(this.value), formatStr);
  }
  set formattedDate(value: string | null) {
    this.$emit("input", value ? new Date(value) : null);
  }

  get isoDate() {
    return this.value
      ? formatISO(this.value, { representation: "date" })
      : null;
  }

  setDate(value: Date | string) {
    this.menuOpen = false;
    this.$emit("input", value ? coerceDate(value) : null);
  }
}

function coerceDate(value: string | Date): Date {
  return value instanceof Date ? value : parseISO(value);
}
</script>