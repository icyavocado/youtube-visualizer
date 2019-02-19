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
      barHeight: "",
      radius: 100
    };
  },
  methods: {
    async getVideoInfo() {
      let result = await axios.get(this.infoLink);
      this.videoInfo = this.parse_str(result.data);
    },
    parse_str(str) {
      return str.split("&").reduce(function(params, param) {
        var paramSplit = param.split("=").map(function(value) {
          return decodeURIComponent(value.replace("+", " "));
        });
        params[paramSplit[0]] = paramSplit[1];
        return params;
      }, {});
    },
    getProxy(link) {
      return `https://warm-waters-73002.herokuapp.com/${link}`;
    },
    draw() {
      this.analyser.fftSize = 64;
      let bufferLength = this.analyser.fftSize;
      requestAnimationFrame(this.draw);
      this.barWidth = (this.width / bufferLength) * 0.6;
      const dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      this.ctx.clearRect(
        -1 * (this.width / 2),
        -1 * (this.height / 2),
        this.width,
        this.height
      );
      for (let i = 0; i < bufferLength; i++) {
        let barHeight = dataArray[i];
        this.draw_rectangle({
          rad: (Math.PI * 2 * i) / bufferLength,
          barHeight
        });
      }
    },
    draw_rectangle({ rad, barHeight }) {
      this.ctx.setTransform(1, 0, 0, 1, this.width / 2, this.height / 2);
      this.ctx.rotate(rad);
      this.ctx.translate(0, this.radius);
      this.ctx.fillStyle = "#BF2440";
      this.ctx.fillRect(-1 * (this.barWidth / 2), 0, this.barWidth, barHeight);
      this.ctx.fillStyle = "#FCDB6F";
      this.ctx.fillRect(
        -1 * (this.barWidth / 2),
        0,
        this.barWidth,
        -barHeight * (this.radius / this.height) * 2
      );
      this.ctx.scale(-1, -1);
      this.ctx.translate(0, this.radius * 2);
      this.ctx.fillStyle = "#BF2440";
      this.ctx.fillRect(-1 * (this.barWidth / 2), 0, this.barWidth, barHeight);
      this.ctx.fillStyle = "#FCDB6F";
      this.ctx.fillRect(
        -1 * (this.barWidth / 2),
        0,
        this.barWidth,
        -barHeight * (this.radius / this.height) * 2
      );
    },
    runVisual() {
      this.getVideoInfo();
      this.audio = this.$refs.audio;
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      let audio_streams = {};
      let streamsFilterd = this.streams.filter(
        stream => stream.indexOf("itag") > -1
      );
      streamsFilterd.forEach(stream => {
        let decodeStream = this.parse_str(stream);
        let itag = decodeStream.itag * 1;
        let quality = false;
        switch (itag) {
          case 139:
            quality = "48kbps";
            break;
          case 140:
            quality = "128kbps";
            break;
          case 141:
            quality = "256kbps";
            break;
        }
        if (quality) audio_streams[quality] = decodeStream.url;
      });
      if (audio_streams["128kbps"]) {
        this.audio.src = this.getProxy(audio_streams["128kbps"]);
      } else {
        this.audio.src = this.ovacodaProxy;
      }
      const audioContext = window.webkitAudioContext || window.AudioContext;
      const context = new audioContext();
      const src = context.createMediaElementSource(this.audio);
      this.analyser = context.createAnalyser();
      src.connect(this.analyser);
      this.analyser.connect(context.destination);
      this.draw();
    }
  },
  computed: {
    getVideoId() {
      return this.link.split("v=")[1];
    },
    infoLink() {
      return this.getProxy(
        `https://www.youtube.com/get_video_info?video_id=${this.getVideoId}`
      );
    },
    ovacodaProxy() {
      return this.getVideoId;
    },
    link: {
      get() {
        return this.youtubeLink;
      },
      set(newValue) {
        this.youtubeLink = newValue;
        this.runVisual();
      }
    },
    streams() {
      return (
        this.videoInfo.url_encoded_fmt_stream_map +
        "," +
        this.videoInfo.adaptive_fmts
      ).split(",");
    }
  },
  mounted() {
    this.runVisual();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body {
  overflow: hidden;
  background: url(https://konachan.com/sample/de6fa4fecda900015ca13a8a95763705/Konachan.com%20-%20278829%20sample.jpg)
    no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  padding: 0px;
  margin: 0px;
  height: 100vh;
}

.Visualizer__app {
  width: 100vw;
  height: 100vh;
}
.Visualizer__app .audio-container {
  position: relative;
  left: 50%;
}

.Visualizer__app audio {
  position: absolute;
  bottom: 20px;
  left: 20px;
}

.Visualizer__app canvas {
  position: absolute;
  right: 0px;
  top: 10%;
}

#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: 50% 50%;
} /* ---- stats.js ---- */
.count-particles {
  background: #000022;
  position: absolute;
  top: 48px;
  left: 0;
  width: 80px;
  color: #13e8e9;
  font-size: 0.8em;
  text-align: left;
  text-indent: 4px;
  line-height: 14px;
  padding-bottom: 2px;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: bold;
}
.js-count-particles {
  font-size: 1.1em;
}
#stats,
.count-particles {
  -webkit-user-select: none;
  margin-top: 5px;
  margin-left: 5px;
}
#stats {
  border-radius: 3px 3px 0 0;
  overflow: hidden;
}
.count-particles {
  border-radius: 0 0 3px 3px;
}
</style>
