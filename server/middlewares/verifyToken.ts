import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomJwtPayload {
  _id: string;
  email: string;
  name: string;
  profileImage: string;
  exp?: number;
}

// 토큰 검증 미들웨어
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // httpOnly 쿠키에서 토큰 확인
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ message: "No access token provided" });
    return;
  }

  const secretKey = process.env.JWT_SECRET || "your_fallback_secret";

  try {
    const decoded = jwt.verify(token, secretKey) as CustomJwtPayload;

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      res.status(401).json({ message: "토큰이 만료되었습니다." });
      return;
    }

    req.user = {
      id: decoded._id,
      email: decoded.email,
      name: decoded.name,
      profileImage: decoded.profileImage,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "토큰이 만료되었습니다." });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ message: "유효하지 않은 토큰입니다." });
      return;
    }

    console.error("JWT 검증 실패:", error);
    res.status(500).json({ message: "토큰 검증 중 오류가 발생했습니다." });
    return;
  }
};
