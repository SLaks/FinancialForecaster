<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <div class="shrink mt-1 hidden-sm-and-down">MortgageCalc</div>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <Home />
    </v-content>
  </v-app>
</template>

<style lang="scss">
@import "./variables";

@media (min-width: $largeWidth + 1) {
  html,
  body,
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
export default class App extends Vue {}
</script>

