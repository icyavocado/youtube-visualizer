/*
  https://stackoverflow.com/questions/8690255/how-to-play-only-the-audio-of-a-youtube-video-using-html-5
*/

const youtubeLink = "https://www.youtube.com/watch?v=MVMIwIJtMdU";
const videoYt = document.getElementById("youtube");
const WIDTH = 1500;
const HEIGHT = 500;
let analyser;

const actions = {
  async getInfo(link) {
    const infoLink = helpers.getVideoId(link);
    let result = await axios.get(infoLink);
    return helpers.parse_str(result.data);
  }
};

const helpers = {
  getVideoId(link) {
    const videoId = link.split("v=")[1];
    return helpers.proxy(
      `https://www.youtube.com/get_video_info?video_id=${videoId}`
    );
  },
  proxy(link) {
    return `https://cors-anywhere.herokuapp.com/${link}`;
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
  videoYt.src = helpers.proxy(audio_streams["128kbps"]);
  const audioContext = window.webkitAudioContext || window.AudioContext;
  const context = new audioContext();
  const src = context.createMediaElementSource(videoYt);
  analyser = context.createAnalyser();
  src.connect(analyser);
  analyser.connect(context.destination);
  draw();
});

function draw() {
  analyser.fftSize = 32768;
  let bufferLength = analyser.fftSize;
  let canvasCtx = document.getElementById("canvas").getContext("2d");
  drawVisual = requestAnimationFrame(draw);
  let barWidth = (WIDTH / bufferLength) * 25;
  let barHeight;
  let x = 0;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  canvasCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  for (var i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] / 2;
    canvasCtx.fillStyle = "#FF0000";
    canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);
    x += barWidth + 0.5;
  }
}
