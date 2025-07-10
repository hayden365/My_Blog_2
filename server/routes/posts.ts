import express, { Request, Response, Router, RequestHandler } from "express";
import Post from "../models/Post";
import Tag from "../models/Tag";
import slugify from "../hooks/slugify";
import { verifyToken } from "../middlewares/verifyToken";
import { createOrUpdateTags, syncPostTags } from "../hooks/tagManager";
import Project from "../models/Project";

interface CustomUser {
  id: string;
}

const router: Router = express.Router();

// Create a post
router.post("/", verifyToken, (async (req: Request, res: Response) => {
  try {
    const {
      title,
      subtitle,
      content_json,
      tags,
      projects,
      img_thumbnail,
      types,
    } = req.body;

    // 태그 처리
    const tagIds = await createOrUpdateTags(tags || []);

    // 프로젝트 처리
    const projectIds = await Project.find({ _id: { $in: projects } });

    // slug 생성
    const slug = req.body.slug || (await slugify(title));

    const post = new Post({
      title,
      subtitle,
      content_json,
      slug,
      tags: tagIds,
      authorId: (req.user as CustomUser)?.id,
      projects: projectIds,
      img_thumbnail,
      types,
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
    const { tag, project } = req.query;

    let query = {};

    if (tag) {
      const tagDoc = await Tag.findOne({ name: tag });
      if (tagDoc) {
        query = { tags: tagDoc._id };
      } else {
        res.json([]);
        return;
      }
    }

    if (project) {
      query = { ...query, projects: project };
    }

    const posts = await Post.find(query)
      .populate("tags", "name")
      .populate("projects", "title")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error });
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

    // 클라이언트에서 post 객체로 감싸서 보내므로 req.body.post에서 데이터 추출
    const postData = req.body.post || req.body;

    // 태그 처리
    const oldTagIds = currentPost.tags?.map((tagId) => tagId.toString()) || [];
    const newTagNames = postData.tags || [];
    const newTagIds = await syncPostTags(oldTagIds, newTagNames);

    // 프로젝트 처리
    const projectIds = await Project.find({
      _id: { $in: postData.projects || [] },
    });

    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params._id },
      {
        title: postData.title,
        subtitle: postData.subtitle,
        content_json: postData.content_json,
        slug: await slugify(postData.slug || postData.title, currentPost.slug),
        tags: newTagIds,
        projects: projectIds,
        img_thumbnail: postData.img_thumbnail,
        types: postData.types,
      },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    console.error("Post update error:", err);
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
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("tags", "name")
      .populate("projects", "title");
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}) as RequestHandler);

// Get post by project id
router.get("/project/:projectId", (async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ projects: req.params.projectId })
      .populate("tags", "name")
      .populate("projects", "title")
      .sort({ createdAt: -1 });

    const typeStats = {
      "error-handling": 0,
      feature: 0,
      theory: 0,
      retrospective: 0,
      design: 0,
      uncategorized: 0,
    };

    posts.forEach((post) => {
      if (post.types && post.types.length > 0) {
        post.types.forEach((type) => {
          if (typeStats[type as keyof typeof typeStats] !== undefined) {
            typeStats[type as keyof typeof typeStats]++;
          }
        });
      } else {
        typeStats["uncategorized"]++;
      }
    });

    const result = {
      posts,
      typeStats: Object.fromEntries(
        Object.entries(typeStats).filter(([_, count]) => count > 0)
      ),
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}) as RequestHandler);

export default router;
