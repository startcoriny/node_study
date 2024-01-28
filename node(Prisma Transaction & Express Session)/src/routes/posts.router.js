import express from "express";
import { prisma } from "../until/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/** 게시글 생성 API **/
// 사용자(Users)는 여러개의 게시글(Posts)을 등록
// 조건에 따라 사용자와 1:N의 관계를 가지고, 현재 로그인 한 사용자의 정보가 존재하였을 때만 게시글을 생성
router.post("/posts", authMiddleware, async (req, res, next) => {
  const { userId } = req.user; // 사용자 인증 미들웨어(authMiddleware)를 통해 클라이언트가 로그인된 사용자인지 검증
  const { title, content } = req.body;

  const post = await prisma.posts.create({
    data: {
      userId: +userId,
      title,
      content,
    },
  });

  return res.status(201).json({ data: post });
});

/** 게시글 목록 조회 API **/
router.get("/posts", async (req, res, next) => {
  const posts = await prisma.posts.findMany({
    select: {
      postId: true,
      userId: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc", // 게시글을 최신순으로 정렬합니다.
    },
  });

  return res.status(200).json({ data: posts });
});

/** 게시글 상세 조회 API **/
router.get("/posts/:postId", async (req, res, next) => {
  const { postId } = req.params;
  const post = await prisma.posts.findFirst({
    where: {
      postId: +postId,
    },
    select: {
      postId: true,
      userId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({ data: post });
});

export default router;
