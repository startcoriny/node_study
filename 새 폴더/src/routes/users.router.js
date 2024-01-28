// src/routes/users.router.js

/** 사용자 회원가입 API 에러 처리 미들웨어 **/
router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, name, age, gender, profileImage } = req.body;
    const isExistUser = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (isExistUser) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

    // 사용자 비밀번호를 암호화합니다.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Users 테이블에 사용자를 추가합니다.
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword, // 암호화된 비밀번호를 저장합니다.
      },
    });

    // UserInfos 테이블에 사용자 정보를 추가합니다.
    const userInfo = await prisma.userInfos.create({
      data: {
        userId: user.userId, // 생성한 유저의 userId를 바탕으로 사용자 정보를 생성합니다.
        name,
        age,
        gender: gender.toUpperCase(), // 성별을 대문자로 변환합니다.
        profileImage,
      },
    });

    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});
