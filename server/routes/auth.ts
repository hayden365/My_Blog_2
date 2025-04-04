import { Router, RequestHandler } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

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
  (async (req, res) => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }

    const user = req.user as { _id: string; email: string; name: string };
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.redirect(`${process.env.FRONTEND_URL}/login/success?token=${token}`);
  }) as RequestHandler
);

export default router;
