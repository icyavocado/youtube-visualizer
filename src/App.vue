<template>
  <div id="app">
    <visualizer width="1000" height="1000"/>
    <bubble
      :config="{
        colorStart: '#fff4e6',
        colorStop: '#ffe9e4',
        blur: 4,
        compose: 'source-over',
        bubbleFunc:() => `hsla(${Math.random() * 50}, 100%, 50%, .3)`
      }"
    />
  </div>
</template>

<script>
import Visualizer from "@/components/Visualizer";
import Bubble from "@/components/Bubble";

export default {
  name: "app",
  components: {
    Visualizer,
    Bubble
  }
};
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
}
</style>
