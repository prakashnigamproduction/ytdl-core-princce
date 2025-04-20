const express = require("express");
const ytdl = require("ytdl-core");
const app = express();
const cors = require("cors");

app.use(cors());

app.get("/api/download", async (req, res) => {
  const videoURL = req.query.url;
  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const info = await ytdl.getInfo(videoURL);
  const format = ytdl.chooseFormat(info.formats, { quality: "highest" });
  res.json({
    title: info.videoDetails.title,
    url: format.url,
    thumbnail: info.videoDetails.thumbnails.pop(),
    formats: info.formats.map(f => ({
      quality: f.qualityLabel,
      type: f.container,
      url: f.url
    }))
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
