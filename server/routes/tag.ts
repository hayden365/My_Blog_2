import express, { Request, Response, RequestHandler } from "express";
import Tag from "../models/Tag";

const router = express.Router();

// 태그 전체 조회
router.get("/", (async (req: Request, res: Response) => {
  const tags = await Tag.find();
  res.json(tags);
}) as RequestHandler);

// 태그 검색
router.get("/search", (async (req: Request, res: Response) => {
  const query = req.query.query as string;
  if (!query || query.trim() === "") {
    return res.json([]);
  }

  try {
    const tags = await Tag.find({
      name: { $regex: query, $options: "i" },
      count: { $gt: 0 },
    })
      .sort({ count: -1 })
      .limit(5)
      .select("name count");

    res.json(tags);
  } catch (error) {
    console.error("Tag search error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}) as RequestHandler);

// 태그 삭제
router.delete("/:_id", (async (req: Request, res: Response) => {
  const tagId = req.params._id;
  const tag = await Tag.findByIdAndDelete(tagId);
  res.json(tag);
}) as RequestHandler);

// 태그 전체 삭제
router.delete("/", (async (req: Request, res: Response) => {
  const tags = await Tag.deleteMany();
  res.json(tags);
}) as RequestHandler);

export default router;
