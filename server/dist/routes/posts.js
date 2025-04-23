"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Post_1 = __importDefault(require("../models/Post"));
const Tag_1 = __importDefault(require("../models/Tag"));
const slugify_1 = __importDefault(require("../hooks/slugify"));
const verifyToken_1 = require("../middlewares/verifyToken");
const tagManager_1 = require("../hooks/tagManager");
const router = express_1.default.Router();
// Create a post
router.post("/", verifyToken_1.verifyToken, (async (req, res) => {
    try {
        const { title, subtitle, content, tags } = req.body;
        // 태그 처리
        const tagIds = await (0, tagManager_1.createOrUpdateTags)(tags || []);
        // slug 생성
        const slug = req.body.slug || (await (0, slugify_1.default)(title));
        const post = new Post_1.default({
            title,
            subtitle,
            content,
            slug,
            tags: tagIds,
            authorId: req.user?.id,
        });
        const savedPost = await post.save();
        res.json(savedPost);
        return;
    }
    catch (err) {
        console.error("Post creation error:", err);
        res.status(500).json({ message: err });
        return;
    }
}));
// Get all posts
router.get("/", (async (req, res) => {
    try {
        const posts = await Post_1.default.find().populate("tags", "name");
        res.json(posts);
    }
    catch (err) {
        res.json({ message: err });
    }
}));
// Get a specific post by id
router.get("/:_id", (async (req, res) => {
    try {
        const post = await Post_1.default.findOne({
            _id: req.params._id,
        }).populate("tags", "name");
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.json(post);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
// Update a post
router.put("/:_id", verifyToken_1.verifyToken, (async (req, res) => {
    try {
        const currentPost = await Post_1.default.findOne({
            _id: req.params._id,
        });
        if (!currentPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        // 태그 처리
        const oldTagIds = currentPost.tags?.map((tagId) => tagId.toString()) || [];
        const newTagNames = req.body.tags || [];
        const newTagIds = await (0, tagManager_1.syncPostTags)(oldTagIds, newTagNames);
        const updatedPost = await Post_1.default.findOneAndUpdate({ _id: req.params._id }, {
            title: req.body.title,
            subtitle: req.body.subtitle,
            content: req.body.content,
            slug: await (0, slugify_1.default)(req.body.slug || req.body.title, currentPost.slug),
            tags: newTagIds,
        }, { new: true });
        res.json(updatedPost);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
// Delete a post
router.delete("/:_id", verifyToken_1.verifyToken, (async (req, res) => {
    try {
        const postToRemove = await Post_1.default.findOne({
            _id: req.params._id,
        });
        if (!postToRemove) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const postTags = postToRemove.tags || [];
        const removedPost = await Post_1.default.findOneAndDelete({
            _id: req.params._id,
        });
        for (const tagId of postTags) {
            const tag = await Tag_1.default.findByIdAndUpdate(tagId, { $inc: { count: -1 } }, { new: true });
            if (tag && tag.count <= 0) {
                await Tag_1.default.findByIdAndDelete(tagId);
            }
        }
        res.json(removedPost);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
// Get post by slug (for client-side routing)
router.get("/slug/:slug", (async (req, res) => {
    try {
        const post = await Post_1.default.findOne({ slug: req.params.slug }).populate("tags", "name");
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.json(post);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
exports.default = router;
