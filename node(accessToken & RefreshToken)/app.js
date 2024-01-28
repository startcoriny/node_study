// app.js

import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 3019;

// 비밀 키는 외부에 노출되면 안되겠죠? 그렇기 때문에, .env 파일을 이용해 비밀 키를 관리해야합니다.
const ACCESS_TOKEN_SECRET_KEY = `startCoriny`; // Access Token의 비밀 키를 정의합니다.
const REFRESH_TOKEN_SECRET_KEY = `coriny`; // Refresh Token의 비밀 키를 정의합니다.

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.status(200).send("Hello Token!");
});

let tokenStorage = {}; // Refresh Token을 저장할 객체

/** Access Token, Refresh Token 발급 API **/
app.post("/tokens", (req, res) => {
  const { id } = req.body;
  const accessToken = createAccessToken(id);
  const refreshToken = createRefreshToken(id);

  // Refresh Token을 가지고 해당 유저의 정보를 서버에 저장합니다. 하지만 이방법은 사용하면안됩니다.
  // 이는 인 메모리(In-Memory) 방식을 사용하기 때문에 서버가 재시작 또는 종료될 경우 모든 정보가 사라지게되기 때문에
  // 실제 서비스에서는 별도의 테이블에서 Refresh Token을 저장하고 관리한답니다.
  tokenStorage[refreshToken] = {
    id: id, // 사용자에게 전달받은 ID를 저장합니다.
    ip: req.ip, // 사용자의 IP 정보를 저장합니다.
    userAgent: req.headers["user-agent"], // 사용자의 User Agent 정보를 저장합니다.
  };

  res.cookie("accessToken", accessToken); // Access Token을 Cookie에 전달한다.
  res.cookie("refreshToken", refreshToken); // Refresh Token을 Cookie에 전달한다.

  return res
    .status(200)
    .json({ message: "Token이 정상적으로 발급되었습니다." });
});

/** 엑세스 토큰 검증 API **/
// access Token의 유효시간이 10초이므로 확인을 하려면 초를 늘리거나 빠르게 테스트 해야함!!
app.get("/tokens/validate", (req, res) => {
  const accessToken = req.cookies.accessToken;

  // 사용자가 Cookie를 전달할 때, Access Token이 없다면 에러
  if (!accessToken) {
    return res
      .status(400)
      .json({ errorMessage: "Access Token이 존재하지 않습니다." });
  }

  // 사용자가 전달한 Access Token이 유효하지 않을 경우 에러
  const payload = validateToken(accessToken, ACCESS_TOKEN_SECRET_KEY);
  if (!payload) {
    return res
      .status(401)
      .json({ errorMessage: "Access Token이 유효하지 않습니다." });
  }

  const { id } = payload;
  return res.json({
    message: `${id}의 Payload를 가진 Token이 성공적으로 인증되었습니다.`,
  });
});

/** 리프레시 토큰 검증 API **/
app.post("/tokens/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // 사용자가 Cookie를 전달할 때, Refresh Token이 없다면 에러가 발생
  if (!refreshToken)
    return res
      .status(400)
      .json({ errorMessage: "Refresh Token이 존재하지 않습니다." });

  const payload = validateToken(refreshToken, REFRESH_TOKEN_SECRET_KEY);
  // 사용자가 전달한 Refresh Token이 유효하지 않을 경우 에러가 발생
  if (!payload) {
    return res
      .status(401)
      .json({ errorMessage: "Refresh Token이 유효하지 않습니다." });
  }

  const userInfo = tokenStorage[refreshToken];
  // Refresh Token이 유효하지만, 서버에 해당 토큰 정보가 없을 경우 에러가 발생
  if (!userInfo)
    return res.status(419).json({
      errorMessage: "Refresh Token의 정보가 서버에 존재하지 않습니다.",
    });

  const newAccessToken = createAccessToken(userInfo.id);

  res.cookie("accessToken", newAccessToken);
  return res.json({ message: "Access Token을 새롭게 발급하였습니다." });
});

// Token을 검증하고 Payload를 반환합니다.
// 제공된 토큰이 유효한지 여부를 검증하는 역할을 담당
// secretKey를 전달받아, 서버에서 검증할 비밀 키를 설정, Access Token 이나 Refresh Token이 저희가 발급한 것인지 검증, Access Token 이나 Refresh Token의 만료 여부를 검증
function validateToken(token, secretKey) {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}

// Access Token을 생성하는 함수
// set-token API를 호출할 때 전달받은 id를 jwt페이로드에 삽입하는 방식으로 Access Token을 생성
// 이렇게 생성된 Access Token은 사용자의 id를 확인하는 데 필요하며, 인증 과정에서는 이 정보를 바탕으로 인증을 진행
function createAccessToken(id) {
  const accessToken = jwt.sign(
    { id: id }, // JWT 데이터
    ACCESS_TOKEN_SECRET_KEY, // Access Token의 비밀 키
    { expiresIn: "10s" } // Access Token이 10초 뒤에 만료되도록 설정합니다.
  );

  return accessToken;
}

// Refresh Token을 생성하는 함수
// jwt에서 전달받은 id를 삽입하여 Refresh Token을 생성하며, 동시에 Refresh Token과 연관된 사용자 정보를 tokenStorage라는 변수에 저장
function createRefreshToken(id) {
  const refreshToken = jwt.sign(
    { id: id }, // JWT 데이터
    REFRESH_TOKEN_SECRET_KEY, // Refresh Token의 비밀 키
    { expiresIn: "7d" } // Refresh Token이 7일 뒤에 만료되도록 설정합니다.
  );

  return refreshToken;
}

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
