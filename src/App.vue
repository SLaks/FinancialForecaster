<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Logo"
          class="shrink mr-4"
          contain
          src="./assets/logo.svg"
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title>Financial Forecaster</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>
      <v-switch v-model="isDark" label="Dark theme" hide-details />
    </v-app-bar>


    <v-main>
      <Home :is-dark.sync="isDark" />
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import "./variables";

@media (min-width: $largeWidth + 1) {
  html,
  body,
  .v-main,
  .v-application,
  .v-content,
  .Root {
    max-height: 100%;
    overflow: hidden;
    height: 100%;
  }
}
</style>

<script lang="ts">
import "reflect-metadata";
import { Component, Vue } from "vue-property-decorator";
import Home from "./components/Home.vue";

@Component({ components: { Home } })
export default class App extends Vue {
  isDark = false;
}
</script>

