import express from "express";
import { prisma } from "../until/prisma/index.js";
import bcrypt from "bcrypt"; // 단방향 암호화 (비밀번호 암호화)
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/** 회원가입 **/
router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, name, age, gender, profileImage } = req.body;

    // prisma에서는 테이블 이름 또는 모델 이름의 대소문자를 구분하지 않음.
    const isExistUser = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (isExistUser) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

    //사용자 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // MySQL과 연결된 Prisma 클라이언트를 통해 트랜잭션을 실행합니다.
    const [user, userInfo] = await prisma.$transaction(
      async (tx) => {
        // 트랜잭션 내부에서 사용자를 생성합니다.
        // Users 테이블에 사용자를 추가합니다.
        const user = await tx.users.create({
          data: {
            email,
            password: hashedPassword, //암호화된 비밀번호 저장.
          },
        });

        //트랜잭션 내부에서 사용자 정보를 생성합니다.
        // UserInfos 테이블에 사용자 정보를 추가합니다.
        const userInfo = await tx.userInfos.create({
          data: {
            userId: user.userId, // 생성한 유저의 userId를 바탕으로 사용자 정보를 생성합니다.
            name,
            age,
            gender: gender.toUpperCase(), // 성별을 대문자로 변환합니다.
            profileImage,
          },
        });

        // 콜백 함수의 리턴값으로 사용자와 사용자 정보를 반환합니다.
        return [user, userInfo];
      },
      { isolationLevel: prisma.TransactionIsolationLevel.ReadCommitted } // IsolationLevel옵션을 정의함으로써 Prisma의 격리수준을 설정할수 있다.
    );

    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});

/** 로그인 **/
router.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  const isExistUser = await prisma.users.findFirst({ where: { email } });

  if (!isExistUser) {
    return res.status(401).json({ message: "존재하지 않는 이메일 입니다." });

    // 사용자가 입력한 패스워드와 bcrypt로 변환되어 db에 저장된 암호를 비교.
  } else if (!(await bcrypt.compare(password, isExistUser.password))) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  // // 로그인에 성공하면, 사용자의 userId를 바탕으로 토큰을 생성합니다.
  // const token = jwt.sign(
  //   {
  //     userId: isExistUser.userId,
  //   },
  //   "custom-secret-key"
  // );

  // // authotization 쿠키에 Berer 토큰 형식으로 JWT를 저장합니다.
  // res.cookie("authorization", `Bearer ${token}`);
  // 위 토큰 생성및 저장 과정이

  // 이 과정으로 간소화 됨.
  // 로그인에 성공하면, 사용자의 userId를 바탕으로 세션을 생성합니다.
  req.session.userId = user.userId;

  return res.status(200).json({ message: "로그인 성공" });
});

/** 사용자조회 **/
router.get("/users", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  const user = await prisma.users.findFirst({
    where: { userId: +userId },
    select: {
      userId: true,
      email: true,
      createdAt: true,
      updateAt: true,
      userInfos: {
        // 1:1 관계를 맺고있는 UserInfos 테이블을 조회합니다.
        select: {
          name: true,
          age: true,
          gender: true,
          profileImage: true,
        },
      },
    },
  });

  return res.status(200).json({ data: user });
});

/** 사용자 정보 변경 **/
router.patch("/users/", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const updatedData = req.body;

    const userInfo = await prisma.userInfos.findFirst({
      where: { userId: +userId },
    });

    await prisma.$transaction(
      async (tx) => {
        // 트랜잭션 내부에서 사용자 정보를 수정합니다.
        await tx.userInfos.update({
          data: {
            ...updatedData,
          },
          where: {
            userId: userInfo.userId,
          },
        });

        // 변경된 필드만 UseHistories 테이블에 저장합니다.
        for (let key in updatedData) {
          if (userInfo[key] !== updatedData[key]) {
            await tx.userHistories.create({
              data: {
                userId: userInfo.userId,
                changedField: key,
                oldValue: String(userInfo[key]),
                newValue: String(updatedData[key]),
              },
            });
          }
        }
      },
      {
        isolationLevel: prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

    return res
      .status(200)
      .json({ message: "사용자 정보 변경에 성공하였습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
