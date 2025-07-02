import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  frontend_tech: {
    type: [String],
    required: false,
  },
  backend_tech: {
    type: [String],
    required: false,
  },
  isGroupProject: {
    type: Boolean,
    default: false,
  },
  myRole: {
    type: String,
    required: false, // 그룹 프로젝트인 경우에만 필수
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false, // 진행중인 프로젝트의 경우 null
  },
  isOngoing: {
    type: Boolean,
    default: false,
  },
  links: {
    type: [String],
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Project", projectSchema);
