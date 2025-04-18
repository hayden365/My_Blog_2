import express, { Request, Response, Router, RequestHandler } from "express";
import Post from "../models/Post";
import Tag from "../models/Tag";
import slugify from "../hooks/slugify";
import { verifyToken } from "../middlewares/verifyToken";
import { createOrUpdateTags, syncPostTags } from "../hooks/tagManager";

interface CustomUser {
  id: string;
}

const router: Router = express.Router();

// Create a post
router.post("/", verifyToken, (async (req: Request, res: Response) => {
  try {
    const { title, subtitle, content, tags } = req.body;

    // 태그 처리
    const tagIds = await createOrUpdateTags(tags || []);

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
    const posts = await Post.find().populate("tags", "name");
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
}) as RequestHandler);

// Get a specific post by id
router.get("/:_id", (async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({
      _id: req.params._id,
    }).populate("tags", "name");

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
router.put("/:_id", verifyToken, (async (req: Request, res: Response) => {
  try {
    const currentPost = await Post.findOne({
      _id: req.params._id,
    });

    if (!currentPost) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // 태그 처리
    const oldTagIds = currentPost.tags?.map((tagId) => tagId.toString()) || [];
    const newTagNames = req.body.tags || [];

    const newTagIds = await syncPostTags(oldTagIds, newTagNames);

    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params._id },
      {
        title: req.body.title,
        subtitle: req.body.subtitle,
        content: req.body.content,
        slug: await slugify(req.body.slug || req.body.title, currentPost.slug),
        tags: newTagIds,
      },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}) as RequestHandler);

// Delete a post
router.delete("/:_id", verifyToken, (async (req: Request, res: Response) => {
  try {
    const postToRemove = await Post.findOne({
      _id: req.params._id,
    });

    if (!postToRemove) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const postTags = postToRemove.tags || [];

    const removedPost = await Post.findOneAndDelete({
      _id: req.params._id,
    });

    for (const tagId of postTags) {
      const tag = await Tag.findByIdAndUpdate(
        tagId,
        { $inc: { count: -1 } },
        { new: true }
      );

      if (tag && tag.count <= 0) {
        await Tag.findByIdAndDelete(tagId);
      }
    }

    res.json(removedPost);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}) as RequestHandler);

// Get post by slug (for client-side routing)
router.get("/slug/:slug", (async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      "tags",
      "name"
    );
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
