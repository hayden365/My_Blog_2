import { Request, Response, Router, RequestHandler } from "express";
import passport from "passport";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import crypto from "crypto";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your_refresh_secret";

// 타입 정의
interface AuthenticatedUser {
  _id: string;
  email: string;
  name: string;
  profileImage: string;
}

interface RefreshTokenPayload extends JwtPayload {
  _id: string;
  tokenVersion: string;
}

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

    const user = req.user as AuthenticatedUser;
    const tokenVersion = crypto.randomBytes(8).toString("hex");

    console.log("🔐 사용자 정보:", {
      _id: user._id,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
    });

    // 짧은 수명의 액세스 토큰 생성
    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    console.log("🎫 액세스 토큰 생성 완료:", {
      토큰_길이: accessToken.length,
      JWT_SECRET_길이: JWT_SECRET.length,
      만료시간: "15m",
    });

    // 긴 수명의 리프레시 토큰 생성
    const refreshToken = jwt.sign(
      {
        _id: user._id,
        tokenVersion,
      },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 리프레시 토큰을 DB에 저장 (무효화를 위해)
    User.findByIdAndUpdate(user._id, {
      refreshToken: crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex"),
      tokenVersion,
    }).exec();

    // 리프레시 토큰을 쿠키에 저장
    const isProduction = process.env.NODE_ENV === "production";
    const isSecure = isProduction;
    const sameSite = isProduction ? "strict" : "lax";

    console.log("🍪 쿠키 설정 정보:", {
      isProduction,
      isSecure,
      sameSite,
      NODE_ENV: process.env.NODE_ENV,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      path: "/",
    });

    // 액세스 토큰을 쿠키에 저장
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: sameSite,
      maxAge: 15 * 60 * 1000, // 15분
      path: "/",
    });

    console.log("🍪 쿠키 설정 완료:");
    console.log("- accessToken:", accessToken.substring(0, 20) + "...");
    console.log("- httpOnly:", true);
    console.log("- secure:", isSecure);
    console.log("- sameSite:", sameSite);
    console.log("- path: /");

    res.redirect(`${process.env.FRONTEND_URL}/login/success`);
  }
);

// 기존 사용자 삭제 API deleteByEmail
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

// POST /auth/refresh
router.post("/refresh", (async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET
    ) as RefreshTokenPayload;
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 토큰 버전 확인
    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(403).json({ message: "Token version mismatch" });
    }

    // 저장된 해시와 비교
    const hashedRefresh = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    if (user.refreshToken !== hashedRefresh) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // 새로운 액세스 토큰 생성
    const newAccessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 새로운 액세스 토큰을 쿠키에 저장
    const isProduction = process.env.NODE_ENV === "production";
    const isSecure = isProduction;
    const sameSite = isProduction ? "strict" : "lax";

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: sameSite,
      maxAge: 15 * 60 * 1000, // 15분
      path: "/",
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Refresh token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}) as RequestHandler);

// POST /auth/logout
router.post("/logout", (async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          JWT_REFRESH_SECRET
        ) as RefreshTokenPayload;
        await User.findByIdAndUpdate(decoded._id, {
          $unset: { refreshToken: 1, tokenVersion: 1 },
        });
      } catch (jwtError) {
        // JWT 검증 실패는 무시하고 쿠키만 삭제
        console.warn("Invalid refresh token during logout:", jwtError);
      }
    }

    const isProduction = process.env.NODE_ENV === "production";
    const isSecure = isProduction;
    const sameSite = isProduction ? "strict" : "lax";

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isSecure,
      sameSite: sameSite,
      maxAge: 0,
      path: "/",
    });

    // 액세스 토큰 쿠키도 삭제
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isSecure,
      sameSite: sameSite,
      maxAge: 0,
      path: "/",
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
}) as RequestHandler);

// GET /auth/me - 현재 사용자 정보 가져오기
router.get("/me", (async (req: Request, res: Response) => {
  console.log("=== /auth/me API 호출 ===");
  console.log("요청 헤더:", req.headers);
  console.log("전체 쿠키:", req.cookies);
  console.log("accessToken 쿠키:", req.cookies.accessToken);
  console.log("JWT_SECRET 존재 여부:", !!JWT_SECRET);
  console.log("JWT_SECRET 길이:", JWT_SECRET?.length);

  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    console.log("❌ accessToken이 없음");
    return res.status(401).json({ message: "No access token provided" });
  }

  console.log("✅ accessToken 발견:", accessToken.substring(0, 20) + "...");
  console.log("토큰 전체 길이:", accessToken.length);

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as any;
    console.log("✅ 토큰 검증 성공:", decoded.email);
    console.log("토큰 페이로드:", decoded);

    res.json({
      _id: decoded._id,
      email: decoded.email,
      name: decoded.name,
      profileImage: decoded.profileImage,
    });
  } catch (error) {
    console.log("❌ 토큰 검증 실패:", error);
    console.log(
      "에러 타입:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.log(
      "에러 메시지:",
      error instanceof Error ? error.message : String(error)
    );

    if (error instanceof jwt.TokenExpiredError) {
      console.log("토큰 만료됨");
      return res.status(401).json({ message: "Access token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      console.log("JWT 형식 오류");
      return res.status(403).json({ message: "Invalid access token" });
    }
    console.error("Get user info error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}) as RequestHandler);

export default router;
