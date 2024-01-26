import express from "express";
import cookieParser from "cookie-parser";
const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cookieParser()); // cookie-parser 미들웨어 적용

// // 'Set-Cookie'를 이용하여 쿠키를 할당하는 API
// app.get("/set-cookie", (req, res) => {
//   let expire = new Date();
//   expire.setMinutes(expire.getMinutes() + 60); // 만료 시간을 60분으로 설정합니다.

//   res.writeHead(200, {
//     "Set-Cookie": `name=sparta; Expires=${expire.toGMTString()}; HttpOnly; Path=/`,
//   });
//   return res.end();
// });

// // 'res.cookie()'를 이용하여 쿠키를 할당하는 API
// app.get("/set-cookie", (req, res) => {
//   let expires = new Date();
//   expires.setMinutes(expires.getMinutes() + 60); // 만료 시간을 60분으로 설정합니다.

//   res.cookie("name", "coriny", {
//     expires: expires,
//   });
//   return res.end();
// });

// 'req.headers.cookie'를 이용하여 클라이언트의 모든 쿠키를 조회하는 API
app.get("/get-cookie", (req, res) => {
  //   const cookie = req.headers;
  const cookie = req.cookies; // cookie-parser를 사용함으로써 header에서 가져오지않아도 클라이언트의 모든 쿠키를 조회함. + 객체 형태로 변환.
  console.log(cookie); // name=coriny
  return res.status(200).json({ cookie });
});

// 세션세팅하기
let session = {};
app.get("/set-session", function (req, res, next) {
  // 현재는 coriny라는 이름으로 저장하지만, 나중에는 복잡한 사용자의 정보로 변경
  const name = "coriny";
  const uniqueInt = Date.now();
  console.log(Date.now()); // now() 메소드는 1970년 1월 1일 0시 0분 0초부터 현재까지 경과된 밀리초를 Number 형으로 반환
  // 세션에 사용자의 시간 정보 저장
  session[uniqueInt] = { name };

  res.cookie("sessionKey", uniqueInt);
  return res.status(200).end();
});

// 세션 읽기
app.get("/get-session", function (req, res, next) {
  const { sessionKey } = req.cookies;
  // 클라이언트의 쿠키에 저장된 세션키로 서버의 세션 정보를 조회합니다.
  const name = session[sessionKey];
  return res.status(200).json({ name });
});

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
