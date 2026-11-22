const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.YOUTUBE_API_KEY;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://youtubers349.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.get("/", (req, res) => {
  res.send("YouTubers server is running!");
});

app.get("/api/search", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: "YouTube API key is not configured"
      });
    }

    const query = String(req.query.q || "").trim();
    const type = req.query.type === "channel" ? "channel" : "video";

    if (!query) {
      return res.status(400).json({ error: "Введите поисковый запрос" });
    }

    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", query);
    url.searchParams.set("type", type);
    url.searchParams.set("maxResults", "15");
    url.searchParams.set("key", API_KEY);

    const response = await fetch(url);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.listen(PORT, () => {
  console.log(`YouTubers server running on port ${PORT}`);
});
