// server/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    familyName: {
      type: String,
      required: true,
    },
    givenName: {
      type: String,
      required: true,
    },
  },
  profileImage: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", userSchema);
export default User;
