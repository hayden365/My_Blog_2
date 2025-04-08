import { Request, Response, Router, RequestHandler } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User";
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret";

// 구글 로그인 페이지로 리다이렉트
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 구글 로그인 콜백 URL
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }

    const user = req.user as {
      _id: string;
      email: string;
      name: string;
      profileImage: string;
    };

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.redirect(`${process.env.FRONTEND_URL}/login/success?token=${token}`);
  }
);

// 기존 사용자 삭제 API
router.delete("/user", (async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "이메일이 필요합니다." });
    }

    const result = await User.deleteOne({ email });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json({ message: "사용자가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("사용자 삭제 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}) as RequestHandler);

export default router;
