import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  tags: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Tag",
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Post", postSchema);
