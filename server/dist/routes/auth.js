"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_secret";
// 구글 로그인 페이지로 리다이렉트
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
// 구글 로그인 콜백 URL
router.get("/google/callback", passport_1.default.authenticate("google", { session: false }), (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Authentication failed" });
        return;
    }
    const user = req.user;
    // 짧은 수명의 액세스 토큰 생성
    const accessToken = jsonwebtoken_1.default.sign({
        _id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
    }, JWT_SECRET, { expiresIn: "15m" });
    // 긴 수명의 리프레시 토큰 생성
    const refreshToken = jsonwebtoken_1.default.sign({
        _id: user._id,
        tokenVersion: crypto_1.default.randomBytes(8).toString("hex"),
    }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
    // 리프레시 토큰을 DB에 저장 (무효화를 위해)
    User_1.default.findByIdAndUpdate(user._id, {
        refreshToken: crypto_1.default
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex"),
        tokenVersion: crypto_1.default.randomBytes(8).toString("hex"),
    }).exec();
    // 리프레시 토큰을 쿠키에 저장
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
        path: "/",
    });
    res.redirect(`${process.env.FRONTEND_URL}/login/success?token=${accessToken}`);
});
// 기존 사용자 삭제 API deleteByEmail
router.delete("/user", (async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "이메일이 필요합니다." });
        }
        const result = await User_1.default.deleteOne({ email });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }
        res.json({ message: "사용자가 성공적으로 삭제되었습니다." });
    }
    catch (error) {
        console.error("사용자 삭제 중 오류 발생:", error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
}));
// POST /auth/refresh
router.post("/refresh", (async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = await User_1.default.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        // 저장된 해시와 비교
        const hashedRefresh = crypto_1.default
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");
        if (user.refreshToken !== hashedRefresh) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        // 새로운 액세스 토큰 생성
        const newAccessToken = jsonwebtoken_1.default.sign({
            _id: user._id,
            email: user.email,
            name: user.name,
            profileImage: user.profileImage,
        }, JWT_SECRET, { expiresIn: "15m" });
        res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        console.error("Refresh token error:", error);
        res.status(403).json({ message: "Invalid refresh token" });
    }
}));
// POST /auth/logout
router.post("/logout", (async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
            const hashed = crypto_1.default
                .createHash("sha256")
                .update(refreshToken)
                .digest("hex");
            await User_1.default.findByIdAndUpdate(decoded._id, {
                $unset: { refreshToken: 1 },
            });
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 0,
            path: "/",
        });
        res.json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Logout failed" });
    }
}));
exports.default = router;
