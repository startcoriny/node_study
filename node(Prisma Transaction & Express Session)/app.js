import express from "express";
import cookieParser from "cookie-parser";
import expressSession from "express-session"; // 세션 기능을 쉽게 구현하기 위한 미들웨어
import expressMySQLSession from "express-mysql-session"; //외부 세션 스토리지를 사용하기 위한 미들웨어
import dotenv from "dotenv";
import LogMiddleware from "./src/middlewares/log.middleware.js";
import ErrorHandlingMiddleware from "./src/middlewares/error-handling.middleware.js";
import UsersRouter from "./src/routes/user.router.js"; // 유저 정보 라우터
import PostsRouter from "./src/routes/posts.router.js"; // 게시물 정보 라우터
import CommentsRouter from "./src/routes/comments.router.js"; // 댓글 정보 라우터

// .env 파일을 읽어서 process.env에 추가합니다.
dotenv.config();

const app = express();
const PORT = 3018;

// MySQLStore를 Express-Session을 이용해 생성합니다.
const MySQLStore = expressMySQLSession(expressSession);
// MySQLStore를 이용해 세션 외부 스토리지를 선언합니다.
const sessionStore = new MySQLStore({
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  expiration: 1000 * 60 * 60 * 24, // 세션의 만료 기간을 1일로 설정합니다.
  createDatabaseTable: true, // 세션 테이블을 자동으로 생성합니다.
});

app.use(LogMiddleware); // 로그 미들웨어
app.use(express.json()); // json 미들웨어
app.use(cookieParser()); // 쿠키 미들웨어
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET_KEY, // 세션을 암호화하는 비밀 키를 설정
    resave: false, // 클라이언트의 요청이 올 때마다 세션을 새롭게 저장할 지 설정, 변경사항이 없어도 다시 저장
    saveUninitialized: false, // 세션이 초기화되지 않았을 때 세션을 저장할 지 설정
    store: sessionStore, // 외부 세션 스토리지를 MySQLStore로 설정합니다.
    cookie: {
      // 세션 쿠키 설정
      maxAge: 1000 * 60 * 60 * 24, // 쿠키의 만료 기간을 1일로 설정합니다.
    },
  })
);
app.use("/api", [UsersRouter, PostsRouter, CommentsRouter]);
app.use(ErrorHandlingMiddleware); // 에러미들웨어

app.listen(PORT, () => {
  console.log(PORT + "포트로 서버가 시작되었습니다.");
});

// expressMySQLSession 모듈의 가장 큰 문제점
/*
  !!세션 ID로 정보를 조회할 때마다 MySQL의 조회 쿼리를 매번 실행된다는 점!!
  해결하기 위한 다양한 방법
  1. JWT 쿠키를 이용하는 것이 하나의 방법
  2. 외부 세션 스토리지를 캐시 메모리 데이터베이스인 Redis로 변경하는 것

  현재 상황에서 가장 효율적이고, 적합한 기술을 선택하는 것이 가장 중요!!
  외부 세션 스토리지 사용을 원하지 않는다면, JWT쿠키를 사용할 수 있으며, 
  성능 개선이 필요하다면 Redis를 도입하는 것을 고려 할 것!
*/
