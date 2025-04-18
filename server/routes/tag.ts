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
    const tags = await Tag.aggregate([
      {
        $match: {
          name: { $regex: query, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "tags",
          as: "posts",
        },
      },
      {
        $project: {
          name: 1,
          count: { $size: "$posts" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    res.json(tags);
  } catch (error) {
    console.error("Tag search error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}) as RequestHandler);

export default router;
