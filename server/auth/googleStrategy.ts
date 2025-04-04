import dotenv from "dotenv";
import passport from "passport";
import { Strategy, Profile } from "passport-google-oauth20";
import User from "../models/User";

dotenv.config();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth credentials not found");
}

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        // 구글에서 받은 고유 ID로 기존 사용자 있는지 확인
        const existingUser = await User.findOne({ userId: profile.id });
        if (existingUser) {
          return done(null, existingUser); // 이미 있는 사용자
        }

        if (!profile.emails?.[0]?.value) {
          return done(new Error("No email found in profile"));
        }

        // 없다면 새 사용자 등록
        const newUser = await User.create({
          userId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          profileImage: profile.photos?.[0]?.value || "",
        });

        return done(null, newUser); // 새로 만든 사용자
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});
