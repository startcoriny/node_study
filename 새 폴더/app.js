import express from "express";
import cookieParser from "cookie-parser";
import LogMiddleware from "./src/middlewares/log.middleware.js";
import ErrorHandlingMiddleware from "./src/middlewares/error-handling.middleware.js";
import UsersRouter from "./routes/users.router.js";

const app = express();
const PORT = 3018;

app.use(LogMiddleware); // 로그 미들웨어는 클라이언트의 요청이 발생하였을 때, 가장 먼저 실행되어야 하는 미들웨어 입니다. 그렇기 때문에, app.use를 이용한 전역 미들웨어 중에서 가장 최상단에 위치
app.use(express.json());
app.use(cookieParser());
app.use("/api", [UsersRouter]);
app.use(ErrorHandlingMiddleware); //  클라이언트의 요청이 실패하였을 때, 가장 마지막에 실행되어야 하는 미들웨어입니다. 그렇기 때문에 전역 미들웨어 중 가장 최하단에 위치한 것

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
