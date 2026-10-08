// B4F Hub — local assessment API.
//
// This is infrastructure for the take-home assessment. You are NOT asked to
// build or modify this file — it's provided so your frontend has a real API
// to integrate against. It loads deterministic seed data on startup; any
// mutations you make (new posts, likes, applications) live only in this
// server's memory and will reset the next time it restarts.
//
// This already runs automatically as part of `npm run dev` — you do not
// need to start it separately.

import express from "express";
import { initialPosts, initialOpportunities } from "./data.js";

const PORT = 3001;

const app = express();
app.use(express.json());

let posts = initialPosts.map((post) => ({ ...post }));
let opportunities = initialOpportunities.map((opportunity) => ({ ...opportunity }));
let nextPostId = Math.max(...posts.map((post) => post.id)) + 1;

const ALLOWED_CATEGORIES = ["announcement", "event", "community", "resource"];
const MIN_CONTENT_LENGTH = 3;
const MAX_CONTENT_LENGTH = 2000;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------- Community ----------

app.get("/api/posts", async (req, res) => {
  await delay(350);

  const sorted = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  res.json(sorted);
});

app.post("/api/posts", (req, res) => {
  const { content, category } = req.body ?? {};

  if (typeof content !== "string") {
    return res.status(400).json({ error: "content is required and must be a string." });
  }

  const trimmedContent = content.trim();

  if (trimmedContent.length < MIN_CONTENT_LENGTH) {
    return res
      .status(400)
      .json({ error: `content must be at least ${MIN_CONTENT_LENGTH} characters.` });
  }

  if (trimmedContent.length > MAX_CONTENT_LENGTH) {
    return res
      .status(400)
      .json({ error: `content must be ${MAX_CONTENT_LENGTH} characters or fewer.` });
  }

  if (typeof category !== "string" || !ALLOWED_CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: `category is required and must be one of: ${ALLOWED_CATEGORIES.join(", ")}.`,
    });
  }

  const newPost = {
    id: nextPostId,
    author: "You",
    avatar: "YOU",
    category,
    content: trimmedContent,
    createdAt: new Date().toISOString(),
    likes: 0,
    liked: false,
  };

  nextPostId += 1;
  posts = [newPost, ...posts];

  res.status(201).json(newPost);
});

app.patch("/api/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const { liked } = req.body ?? {};

  if (typeof liked !== "boolean") {
    return res.status(400).json({ error: "liked is required and must be a boolean." });
  }

  const post = posts.find((candidate) => candidate.id === id);

  if (!post) {
    return res.status(404).json({ error: `No post found with id ${id}.` });
  }

  if (liked && !post.liked) {
    post.liked = true;
    post.likes += 1;
  } else if (!liked && post.liked) {
    post.liked = false;
    post.likes -= 1;
  }

  res.json(post);
});

// ---------- Opportunities ----------

app.get("/api/opportunities", async (req, res) => {
  await delay(350);
  res.json(opportunities);
});

app.patch("/api/opportunities/:id", (req, res) => {
  const id = Number(req.params.id);
  const { applied } = req.body ?? {};

  if (applied !== true) {
    return res.status(400).json({ error: "applied is required and must be true." });
  }

  const opportunity = opportunities.find((candidate) => candidate.id === id);

  if (!opportunity) {
    return res.status(404).json({ error: `No opportunity found with id ${id}.` });
  }

  if (opportunity.applied) {
    return res.status(409).json({ error: "You have already applied to this opportunity." });
  }

  opportunity.applied = true;

  res.json(opportunity);
});

app.listen(PORT, () => {
  console.log(`B4F Hub local API running at http://localhost:${PORT}`);
});
