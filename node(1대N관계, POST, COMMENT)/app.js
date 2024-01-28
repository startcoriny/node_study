import express from "express";
import cookieParser from "cookie-parser";
import LogMiddleware from "./src/middlewares/log.middleware.js";
import ErrorHandlingMiddleware from "./src/middlewares/error-handling.middleware.js";
import UsersRouter from "./src/routes/user.router.js"; // 유저 정보 라우터
import PostsRouter from "./src/routes/posts.router.js"; // 게시물 정보 라우터
import CommentsRouter from "./src/routes/comments.router.js"; // 댓글 정보 라우터

const app = express();
const PORT = 3018;

app.use(LogMiddleware); // 로그 미들웨어
app.use(express.json()); // json 미들웨어
app.use(cookieParser()); // 쿠키 미들웨어
app.use("/api", [UsersRouter, PostsRouter, CommentsRouter]);
app.use(ErrorHandlingMiddleware); // 에러미들웨어

app.listen(PORT, () => {
  console.log(PORT + "포트로 서버가 시작되었습니다.");
});
