import express, { Request, Response, Router, RequestHandler } from "express";
import Post from "../models/Post";
import Tag from "../models/Tag";
import slugify from "../hooks/slugify";
import { verifyToken } from "../middlewares/verifyToken";

interface CustomUser {
  id: string;
}

const router: Router = express.Router();

// Create a post
router.post("/", verifyToken, (async (req: Request, res: Response) => {
  try {
    const { title, subtitle, content, tags } = req.body;

    // 태그 처리
    const tagIds = await Promise.all(
      (tags || []).map(async (tagName: string) => {
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        return tag._id;
      })
    );

    // slug 생성
    const slug = req.body.slug || (await slugify(title));

    const post = new Post({
      title,
      subtitle,
      content,
      slug,
      tags: tagIds,
      authorId: (req.user as CustomUser)?.id,
    });

    const savedPost = await post.save();
    res.json(savedPost);
    return;
  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ message: err });
    return;
  }
}) as RequestHandler);

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
router.get("/:id", (async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}) as RequestHandler);

// Update a post
router.put("/:id", verifyToken, (async (req: Request, res: Response) => {
  try {
    const currentPost = await Post.findById(req.params.id);
    if (!currentPost) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // 태그 처리
    const tagIds = await Promise.all(
      (req.body.tags || []).map(async (tagName: string) => {
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        return tag._id;
      })
    );

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        subtitle: req.body.subtitle,
        content: req.body.content,
        slug: await slugify(req.body.slug || req.body.title, currentPost.slug),
        tags: tagIds,
      },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}) as RequestHandler);

// Delete a post
router.delete("/:id", verifyToken, (async (req: Request, res: Response) => {
  try {
    const removedPost = await Post.findByIdAndDelete(req.params.id);
    if (!removedPost) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(removedPost);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}) as RequestHandler);

// Get post by slug (for client-side routing)
router.get("/slug/:slug", (async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}) as RequestHandler);

export default router;
