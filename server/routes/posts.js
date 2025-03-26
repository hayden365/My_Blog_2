import express from "express";
import Post from "../models/Post.js";
import slugify from "../hooks/slugify.js";

const router = express.Router();

// Create a post
router.post("/", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    slug: req.body.slug ? slug : slugify(req.body.title),
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get a specific post
router.get("/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    res.json(post);
  } catch (err) {
    res.json({ message: err });
  }
});

// Delete a post
router.delete("/:slug", async (req, res) => {
  try {
    const removedPost = await Post.deleteOne({ slug: req.params.slug });
    res.json(removedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

export default router;
