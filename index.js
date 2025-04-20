const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('YouTube Downloader API is live!');
});

app.post('/api/download', async (req, res) => {
  try {
    const videoURL = req.body.url;
    if (!videoURL || !ytdl.validateURL(videoURL)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing YouTube URL',
      });
    }

    const info = await ytdl.getInfo(videoURL);
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');

    res.json({
      success: true,
      title: info.videoDetails.title,
      formats: formats.map(f => ({
        quality: f.qualityLabel,
        container: f.container,
        url: f.url
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error: ' + err.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
