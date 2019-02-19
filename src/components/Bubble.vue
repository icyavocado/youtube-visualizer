<template>
  <canvas ref="bubbly" class="bubbly"></canvas>
</template>

<script>
export default {
  name: "Bubble",
  props: {
    config: Object
  },
  data() {
    return {
      canvas: "",
      context: "",
      width: "",
      height: "",
      gradient: "",
      bubbles: []
    };
  },
  methods: {
    draw() {
      let c = this.config || {};
      if (this.canvas.parentNode === null) {
        return cancelAnimationFrame(this.draw);
      }
      if (c.animate !== false) {
        requestAnimationFrame(this.draw);
      }
      this.context.globalCompositeOperation = "source-over";
      this.context.fillStyle = `rgba(255 ,255, 255, 0.0)`;
      this.context.clearRect(0, 0, this.width, this.height);
      // this.context.globalCompositeOperation = c.compose || "lighter";
      this.bubbles.forEach(bubble => {
        this.context.beginPath();
        this.context.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
        this.context.fillStyle = bubble.f;
        this.context.fill();
        // update positions for next draw
        bubble.x += Math.cos(bubble.a) * bubble.v;
        bubble.y += Math.sin(bubble.a) * bubble.v;
        if (bubble.x - bubble.r > this.width) {
          bubble.x = -bubble.r;
        }
        if (bubble.x + bubble.r < 0) {
          bubble.x = this.width + bubble.r;
        }
        if (bubble.y - bubble.r > this.height) {
          bubble.y = -bubble.r;
        }
        if (bubble.y + bubble.r < 0) {
          bubble.y = this.height + bubble.r;
        }
      });
    }
  },
  mounted() {
    let c = this.config || {};
    this.canvas = this.$refs.bubbly;
    const r = () => Math.random();
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");
    // this.gradient = this.context.createLinearGradient(
    //   0,
    //   0,
    //   this.width,
    //   this.height
    // );
    this.context.shadowColor = c.shadowColor || "#fff";
    this.context.shadowBlur = c.blur || 4;
    // this.gradient.addColorStop(0, c.colorStart || "#2AE");
    // this.gradient.addColorStop(1, c.colorStop || "#17B");
    const nrBubbles =
      c.bubbles || Math.floor((this.width + this.height) * 0.02);
    for (let i = 0; i < nrBubbles; i++) {
      this.bubbles.push({
        f: (c.bubbleFunc || (() => `hsla(0, 0%, 100%, ${r() * 0.1})`)).call(), // fillStyle
        x: r() * this.width, // x-position
        y: r() * this.height, // y-position
        r: (c.radiusFunc || (() => 4 + (r() * this.width) / 25)).call(), // radius
        a: (c.angleFunc || (() => r() * Math.PI * 2)).call(), // angle
        v: (c.velocityFunc || (() => 0.1 + r() * 0.5)).call() // velocity
      });
    }
    this.draw();
  }
};
</script>

<style>
.bubbly {
  position: fixed;
  z-index: -1;
  left: 0;
  top: 0;
  min-width: 100vw;
  min-height: 100vh;
}
</style>