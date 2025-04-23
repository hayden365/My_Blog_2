"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth credentials not found");
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error("No email found in profile"));
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            // 프로필 이미지가 없으면 업데이트
            if (!existingUser.profileImage) {
                existingUser.profileImage = profile.photos?.[0]?.value || "";
                await existingUser.save();
            }
            return done(null, existingUser);
        }
        // 없다면 새 사용자 등록
        const newUser = await User_1.default.create({
            userId: profile.id,
            email,
            name: {
                givenName: profile.name?.givenName ||
                    profile.displayName?.split(" ")[0] ||
                    "User",
                familyName: profile.name?.familyName ||
                    profile.displayName?.split(" ")[1] ||
                    "User",
            },
            profileImage: profile.photos?.[0]?.value || "",
        });
        return done(null, newUser);
    }
    catch (err) {
        return done(err);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((obj, done) => {
    done(null, obj);
});
