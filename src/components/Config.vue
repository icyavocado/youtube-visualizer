<template>
  <div class="Visualizer__app">
    <input type="text" v-model="link">
    <audio ref="audio" autoplay controls loop crossorigin="anonymous"></audio>
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Visualizer",
  props: {
    width: String,
    height: String
  },
  data() {
    return {
      youtubeLink: "https://www.youtube.com/watch?v=KR-eV7fHNbM",
      videoInfo: {},
      audio: "",
      canvas: "",
      ctx: "",
      analyser: "",
      barWidth: "",
      barHeight: ""
    };
  }
};
</script>