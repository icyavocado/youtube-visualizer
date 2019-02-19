/*
  https://stackoverflow.com/questions/8690255/how-to-play-only-the-audio-of-a-youtube-video-using-html-5
*/

const youtubeLink = "https://www.youtube.com/watch?v=v9oyNBBXDi8";
// MVMIwIJtMdU
// KR-eV7fHNbM
const videoYt = document.getElementById("youtube");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let barWidth;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let analyser;

const actions = {
  async getInfo(link) {
    const infoLink = helpers.getVideoInfo(link);
    let result = await axios.get(infoLink);
    return helpers.parse_str(result.data);
  }
};

const helpers = {
  getVideoId(link) {
    return link.split("v=")[1];
  },
  getVideoInfo(link) {
    const videoId = helpers.getVideoId(link);
    return helpers.proxy(
      `https://www.youtube.com/get_video_info?video_id=${videoId}`
    );
  },
  ovacodaProxy(link) {
    const videoId = helpers.getVideoId(link);
    return videoId;
  },
  proxy(link) {
    return `https://warm-waters-73002.herokuapp.com/${link}`;
  },
  parse_str(str) {
    return str.split("&").reduce(function(params, param) {
      var paramSplit = param.split("=").map(function(value) {
        return decodeURIComponent(value.replace("+", " "));
      });
      params[paramSplit[0]] = paramSplit[1];
      return params;
    }, {});
  }
};

actions.getInfo(youtubeLink).then(result => {
  const streams = (
    result.url_encoded_fmt_stream_map +
    "," +
    result.adaptive_fmts
  ).split(",");
  let audio_streams = {};
  let streamsFilterd = streams.filter(stream => stream.indexOf("itag") > -1);
  streamsFilterd.forEach(stream => {
    let decodeStream = helpers.parse_str(stream);
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
    videoYt.src = helpers.proxy(audio_streams["128kbps"]);
  } else {
    videoYt.src = helpers.ovacodaProxy(youtubeLink);
  }
  const audioContext = window.webkitAudioContext || window.AudioContext;
  const context = new audioContext();
  const src = context.createMediaElementSource(videoYt);
  analyser = context.createAnalyser();
  src.connect(analyser);
  analyser.connect(context.destination);
  draw();
});

function draw() {
  analyser.fftSize = 512;
  let bufferLength = analyser.fftSize;
  requestAnimationFrame(draw);
  barWidth = WIDTH / bufferLength;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.clearRect(-1 * (WIDTH / 2), -1 * (HEIGHT / 2), WIDTH, HEIGHT);
  for (let i = 0; i < bufferLength; i++) {
    ctx.fillStyle = "#fe4a49";
    let barHeight = dataArray[i];
    draw_rectangle({
      rad: (Math.PI * 3.14 * i) / (i - bufferLength),
      barHeight
    });
    ctx.scale(-1, 1);
    draw_rectangle({
      rad: (Math.PI * 3.14 * i) / (i - bufferLength),
      barHeight
    });
  }
}

function draw_rectangle({ rad, barHeight }) {
  ctx.setTransform(1, 0, 0, 1, WIDTH / 2, HEIGHT / 2);
  ctx.rotate(rad);
  let radius = 100;
  ctx.translate(0, radius);
  ctx.fillRect(-1 * (barWidth / 2) + 1, 0, barWidth, barHeight);
}

particlesJS("particles-js", {
  particles: {
    number: { value: 15, density: { enable: false, value_area: 800 } },
    color: { value: "#1b1e34" },
    shape: {
      type: "circle",
      stroke: { width: 0, color: "#000" },
      polygon: { nb_sides: 6 },
      image: { src: "img/github.svg", width: 100, height: 100 }
    },
    opacity: {
      value: 0.3,
      random: true,
      anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
    },
    size: {
      value: 100,
      random: true,
      anim: { enable: true, speed: 10, size_min: 40, sync: false }
    },
    line_linked: {
      enable: false,
      distance: 200,
      color: "#ffffff",
      opacity: 1,
      width: 2
    },
    move: {
      enable: true,
      speed: 8,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: { enable: false, rotateX: 600, rotateY: 1200 }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: false, mode: "grab" },
      onclick: { enable: false, mode: "push" },
      resize: true
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 1 } },
      bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 }
    }
  },
  retina_detect: true
});
