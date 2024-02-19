import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { PostsRepository } from "../repositories/posts.repository.js";
import { PostsService } from "../services/posts.service.js";
import { PostsController } from "../controllers/posts.controller.js";

const router = express.Router();

// 3계층의 의존성을 모두 주입합니다.
const postsRepository = new PostsRepository(prisma);
const postsService = new PostsService(postsRepository);
const postsController = new PostsController(postsService);

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
