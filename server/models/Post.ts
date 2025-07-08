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
  isFeatured: {
    type: Boolean,
    default: false,
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
  projects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Project",
    required: false,
  },
  types: {
    type: [String],
    enum: ["error-handling", "feature", "theory", "retrospective", "design"],
    required: false,
    default: [],
  },
  content_json: {
    type: Object,
    required: true,
  },
  img_thumbnail: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Post", postSchema);
