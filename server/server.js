import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/posts", postRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(5000, () => console.log("✅ Server running on port 5000"));
  })
  .catch((err) => console.log(err));
