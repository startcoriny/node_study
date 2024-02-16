import express from "express";
import { PostsController } from "../controllers/posts.controller.js";

const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const postsController = new PostsController();

// 게시글 조회
router.get("/", postsController.getPosts);

// 게시글 작성
router.post("/", postsController.createPost);

// 게시글 상세조회
router.get("/:postId", postsController.getPostById);

// 게시글 수정
router.put("/:postId", postsController.updatePost);

// 게시글 삭제
router.delete("/:postId", postsController.deletePost);

export default router;
