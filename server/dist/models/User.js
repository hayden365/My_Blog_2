"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/models/User.js
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
    refreshToken: {
        type: String,
        default: null,
    },
    tokenVersion: {
        type: String,
        default: null,
    },
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
