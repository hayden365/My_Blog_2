"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Tag_1 = __importDefault(require("../models/Tag"));
const router = express_1.default.Router();
// 태그 전체 조회
router.get("/", (async (req, res) => {
    const tags = await Tag_1.default.find();
    res.json(tags);
}));
// 태그 검색
router.get("/search", (async (req, res) => {
    const query = req.query.query;
    if (!query || query.trim() === "") {
        return res.json([]);
    }
    try {
        const tags = await Tag_1.default.find({
            name: { $regex: query, $options: "i" },
            count: { $gt: 0 },
        })
            .sort({ count: -1 })
            .limit(5)
            .select("name count");
        res.json(tags);
    }
    catch (error) {
        console.error("Tag search error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// 태그 삭제
router.delete("/:_id", (async (req, res) => {
    const tagId = req.params._id;
    const tag = await Tag_1.default.findByIdAndDelete(tagId);
    res.json(tag);
}));
// 태그 전체 삭제
router.delete("/", (async (req, res) => {
    const tags = await Tag_1.default.deleteMany();
    res.json(tags);
}));
exports.default = router;
