import express, { Request, Response, Router, RequestHandler } from "express";
import Post from "../models/Post";
import slugify from "../hooks/slugify";
import { verifyToken } from "../middlewares/verifyToken";

const router: Router = express.Router();

// Create a post
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const currentUserId = req.currentUserId;
    const { title, subtitle, content, slug, tags } = req.body;
    const post = new Post({
      title,
      subtitle,
      content,
      slug,
      tags,
      authorId: currentUserId,
    });
    const savedPost = await post.save();
    res.json(savedPost);
    return;
  } catch (err) {
    res.json({ message: err });
    return;
  }
});

// Get all posts
router.get("/", (async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
}) as RequestHandler);

// Get a specific post
router.get("/:slug", (async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    res.json(post);
  } catch (err) {
    res.json({ message: err });
  }
}) as RequestHandler);

// Update a post
router.put("/:slug", verifyToken, (async (req: Request, res: Response) => {
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      {
        title: req.body.title,
        subtitle: req.body.subtitle,
        content: req.body.content,
        slug: req.body.slug ? req.body.slug : slugify(req.body.title),
        tags: req.body.tags || [],
      },
      { new: true }
    );

    if (!updatedPost) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}) as RequestHandler);

// Delete a post
router.delete("/:slug", verifyToken, (async (req: Request, res: Response) => {
  try {
    const removedPost = await Post.deleteOne({ slug: req.params.slug });
    res.json(removedPost);
  } catch (err) {
    res.json({ message: err });
  }
}) as RequestHandler);

// Delete a post by Id
router.delete("/id/:id", verifyToken, (async (req: Request, res: Response) => {
  try {
    const removedPost = await Post.deleteOne({ _id: req.params.id });
    res.json(removedPost);
  } catch (err) {
    res.json({ message: err });
  }
}) as RequestHandler);

export default router;
