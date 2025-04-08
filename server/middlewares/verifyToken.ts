import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  _id: string;
  email: string;
  name: string;
  profileImage: string;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization header malformed" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const secretKey = process.env.JWT_SECRET || "your_fallback_secret";
  console.log(secretKey, "secretKey");
  try {
    const decoded = jwt.verify(token, secretKey) as CustomJwtPayload;
    req.user = {
      id: decoded._id,
      email: decoded.email,
      name: decoded.name,
      profileImage: decoded.profileImage,
    };
    next();
  } catch (error) {
    console.error("JWT 검증 실패:", error);
    res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    return;
  }
};
