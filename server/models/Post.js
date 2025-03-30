import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Post", postSchema);
