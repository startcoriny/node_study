import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// json데이터 암호화
const token = jwt.sign({ myPayloadData: 1234 }, "mysecretkey");
console.log(token);
console.log("-------------------------------");
console.log();

// 코드로 복호화
const decodedValue = jwt.decode(token);
console.log(decodedValue);
console.log("-------------------------------");
console.log();

// 복호화가 아닌, 변조되지 않은 데이터인지 검증
const decodedValuebyVerify = jwt.verify(token, "mysecretkey");
// const decodedValuebyVerify = jwt.verify(token, "secretkey"); // 잘못된 비밀키를 입력한다면 검증에 실패하여 에러 발생!
console.log(decodedValuebyVerify);

// jwt 적용x 로그인api
app.post("/login", function (req, res, next) {
  const user = {
    // 사용자 정보
    userId: 203, // 사용자의 고유 아이디 (Primary key)
    email: "coriny@gmail.com", // 사용자의 이메일
    name: "코리니", // 사용자의 이름
  };

  res.cookie("coriny", user); // coriny 라는 이름을 가진 쿠키에 user 객체를 할당합니다.
  return res.status(200).end();
});
/*
    위와 같은 방법을 사용할 시 생기는 문제점
    1. 쿠키의 속성값이나 만료 시간을 클라이언트가 언제든지 수정할 수 있습니다.
    2. 쿠키의 위변조 여부를 확인 할 수 없습니다.
*/

// jwt 적용o 로그인api
app.post("/jwtlogin", (req, res) => {
  // 사용자 정보
  const user = {
    userId: 203,
    email: "coriny@gmail.com",
    name: "코리니",
  };

  // 사용자 정보를 JWT로 생성
  const userJWT = jwt.sign(
    user, // user 변수의 데이터를 payload에 할당
    "secretOrPrivateKey", // JWT의 비밀키를 secretOrPrivateKey라는 문자열로 할당
    { expiresIn: "1h" } // JWT의 인증 만료시간을 1시간으로 설정
  );

  // userJWT 변수를 coriny 라는 이름을 가진 쿠키에 Bearer 토큰 형식으로 할당
  res.cookie("coriny", `Bearer ${userJWT}`);
  return res.status(200).end();
});

app.listen(5002, () => {
  console.log(5002, "번호로 서버가 켜졌어요!");
});
