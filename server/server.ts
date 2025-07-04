import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import "./auth/googleStrategy";
import postRoutes from "./routes/posts";
import authRoutes from "./routes/auth";
import tagRoutes from "./routes/tag";
import projectRoutes from "./routes/projects";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";

// 🔧 .env 파일 읽기
dotenv.config();

const app = express();

// 🔧 미들웨어 설정
app.use(express.json());
app.use(cookieParser());

// 🔧 CORS 설정
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// 🔧 환경변수에서 MongoDB URI 불러오기
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;
const session_secret = process.env.SESSION_SECRET;

if (!mongoURI) {
  console.error("❌ MONGO_URI가 .env에서 설정되지 않았습니다.");
  process.exit(1);
}

if (!session_secret) {
  console.error("❌ SESSION_SECRET이 .env에서 설정되지 않았습니다.");
  process.exit(1);
}

// ✅ MongoDB 연결
app.use(
  session({
    secret: session_secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoURI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // 세션 유효기간 14일,
    }),
    cookie: { secure: false },
  })
);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB 연결 성공");
    // 서버 시작
    app.listen(port, () => {
      console.log(`✅ 서버가 포트 ${port}에서 실행 중입니다.`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB 연결 실패:", error);
  });

app.use(passport.initialize());
app.use(passport.session());

// ✅ 라우터 등록
app.use("/posts", postRoutes);
app.use("/auth", authRoutes);
app.use("/tag", tagRoutes);
app.use("/projects", projectRoutes);
