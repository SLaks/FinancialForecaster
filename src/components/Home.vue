<template>
  <div class="home">
    <BasicOptions v-bind="basicOptions" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import BasicOptions from "./BasicOptions.vue";
import { BasicOptionsType, EventDefinition } from "../schema";

@Component({
  components: { BasicOptions }
})
export default class Home extends Vue {
  @Prop({ default: () => new BasicOptionsType() })
  private basicOptions!: BasicOptionsType;
  @Prop({ default: () => [] }) private events!: EventDefinition[];

  get urlState() {
    return { basicOptions: this.basicOptions, events: this.events };
  }

  @Watch("urlState")
  saveState(val: typeof Home.prototype.urlState) {
    location.replace("#" + JSON.stringify(val));
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
