"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Authorization header malformed" });
        return;
    }
    const token = authHeader.split(" ")[1];
    const secretKey = process.env.JWT_SECRET || "your_fallback_secret";
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.user = {
            id: decoded._id,
            email: decoded.email,
            name: decoded.name,
            profileImage: decoded.profileImage,
        };
        next();
    }
    catch (error) {
        console.error("JWT 검증 실패:", error);
        res.status(403).json({ message: "유효하지 않은 토큰입니다." });
        return;
    }
};
exports.verifyToken = verifyToken;
