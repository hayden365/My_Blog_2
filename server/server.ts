import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/posts";

// 🔧 .env 파일 읽기
dotenv.config();

const app = express();

// 🔧 미들웨어 설정
app.use(cors());
app.use(express.json());

// ✅ 라우터 등록
app.use("/posts", postRoutes);

// 🔧 환경변수에서 MongoDB URI 불러오기
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

if (!mongoURI) {
  console.error("❌ MONGO_URI가 .env에서 설정되지 않았습니다.");
  process.exit(1);
}

// ✅ MongoDB 연결
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err.message);
  });
