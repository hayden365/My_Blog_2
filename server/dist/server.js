"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./auth/googleStrategy");
const posts_1 = __importDefault(require("./routes/posts"));
const auth_1 = __importDefault(require("./routes/auth"));
const tag_1 = __importDefault(require("./routes/tag"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// 🔧 .env 파일 읽기
dotenv_1.default.config();
const app = (0, express_1.default)();
// 🔧 미들웨어 설정
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// 🔧 CORS 설정
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
// 🔧 세션 설정
app.use((0, express_session_1.default)({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// ✅ 라우터 등록
app.use("/posts", posts_1.default);
app.use("/auth", auth_1.default);
app.use("/tag", tag_1.default);
// 🔧 환경변수에서 MongoDB URI 불러오기
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;
if (!mongoURI) {
    console.error("❌ MONGO_URI가 .env에서 설정되지 않았습니다.");
    process.exit(1);
}
// ✅ MongoDB 연결
mongoose_1.default
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
