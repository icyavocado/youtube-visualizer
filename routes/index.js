var express = require("express");
var router = express.Router();
var youtubeStream = require("youtube-audio-stream");

/* GET home page. */
router.get("/:videoId", function(req, res, next) {
  if (req.params.videoId.match(/^[0-9a-zA-Z_-]*$/g).length > 0) {
    var requestUrl = "https://www.youtube.com/watch?v=" + req.params.videoId;
    try {
      youtubeStream(requestUrl).pipe(res);
    } catch (exception) {
      res.status(500).send(exception);
    }
  } else {
    return;
  }
});

module.exports = router;
