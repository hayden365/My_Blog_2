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
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in profile"));
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
          // 프로필 이미지가 없으면 업데이트
          if (!existingUser.profileImage) {
            existingUser.profileImage = profile.photos?.[0]?.value || "";
            await existingUser.save();
          }
          return done(null, existingUser);
        }

        // 없다면 새 사용자 등록
        const newUser = await User.create({
          userId: profile.id,
          email,
          name: {
            givenName:
              profile.name?.givenName ||
              profile.displayName?.split(" ")[0] ||
              "User",
            familyName:
              profile.name?.familyName ||
              profile.displayName?.split(" ")[1] ||
              "User",
          },
          profileImage: profile.photos?.[0]?.value || "",
        });

        return done(null, newUser);
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
