// src/routes/comments.router.js
/*
  사용자(Users)는 여러개의 댓글(Comments)을 작성될수 있고
  댓글은 조건에 따라 사용자와 1:N의 관계를 가지고, “하나의 게시글(Posts)은 여러개의 댓글(Comments)이 작성될수 있다.
  조건에 따라 게시글과 1:N의 관계를 가진다.
  현재 로그인한 사용자의 정보가 존재하고, 특정 게시글이 존재하였을 때만 댓글을 생성할 수 있도록 구현
*/

/*  
    일반적인 커뮤니티 사이트에서 게시글을 조회한다면, 하나의 게시글과 해당 게시글에 달린 댓글들을 함께 보여줍니다. 
    구현하는 방법에는
    1. 게시글 상세 조회 API 내부에서 댓글 목록도 함께 반환     
    장점
      • 한 번의 API 호출로 모든 정보를 가져올 수 있으므로 효율적
    단점
      •게시글과 댓글이라는 서로 다른 도메인이 하나의 API에서 처리되어야 하므로, 코드가 복잡

    2. 게시글 조회 API와 댓글 조회 API를 따로 호출하여, 각 정보를 가져옴
    장점
      • 게시글과 댓글이라는 서로 다른 도메인의 데이터를 각각의 API에서 처리하므로, 코드는 간결하고 관리하기 쉬움
    단점
      •프론트엔드에서 두 번의 API 호출이 필요하므로, 응답 시간이 길어질 수 있음.


    이처럼 게시글과 댓글이라는 서로 다른 도메인을 명확하게 분리하였고, 각각이 명확한 ‘역할과 책임’을 가질 수 있도록 구현
*/

/* 역할과 책임
  역할과 책임’에 대한 이야기는 프로그래밍을 하면서 자주 나오는 주제
  하나의 코드가 많은 역할과 책임을 가질 때 발생하는 문제와 하나의 코드가 단 하나의 역할과 책임만 가질 때의 장점에 대한 고민은 
  많은 개발자들이 아직까지도 고민하고 풀고자하는 문제 중 하나입니다.
   “클린 코드(Clean Code)”와 "리팩토링(Refactoring)"이라는 책 을 보고 고민해결해 보도록!!
*/

import express from "express";
import { prisma } from "../until/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/** 댓글 생성 API **/
router.post(
  "/posts/:postId/comments",
  authMiddleware,
  async (req, res, next) => {
    const { postId } = req.params; // 게시물 번호 param으로 가져오기
    const { userId } = req.user; // 토큰 검증을 끝낸 userId 가져오기
    const { content } = req.body; // 게시물에서 보낸 보낸 댓글 가져오기

    const post = await prisma.posts.findFirst({
      where: {
        postId: +postId, // 게시물하나를 찾아라 게시물 id가 해당 id인 곳에서
      },
    });

    // 넘어온 게시물이 없으면 404 return
    if (!post)
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });

    const comment = await prisma.comments.create({
      data: {
        userId: +userId, // 댓글 작성자 ID
        postId: +postId, // 댓글 작성 게시글 ID
        content: content,
      },
    });

    return res.status(201).json({ data: comment });
  }
);

/** 댓글 조회 API **/
router.get("/posts/:postId/comments", async (req, res, next) => {
  const { postId } = req.params;

  const post = await prisma.posts.findFirst({
    where: {
      postId: +postId,
    },
  });
  if (!post)
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });

  const comments = await prisma.comments.findMany({
    where: {
      postId: +postId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json({ data: comments });
});

export default router;
