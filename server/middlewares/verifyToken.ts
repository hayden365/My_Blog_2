import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  user_id: string;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userToken = req.headers["authorization"]?.split(" ")[1] ?? "null";

  if (userToken === "null") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  // 토큰이 정상적인지 확인
  try {
    const secretKey = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(userToken, secretKey) as CustomJwtPayload;
    req.currentUserId = decoded.user_id;
    next();
  } catch (error) {
    res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    return;
  }
};
