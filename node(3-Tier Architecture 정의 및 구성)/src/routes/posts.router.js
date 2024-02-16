import express from "express";
import { PostsController } from "../controllers/posts.controller.js";

const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const postsController = new PostsController();

/** 게시글 조회 API **/
// '/'라는 URI로 GET요청이 들어왔을 경우 postsController에 있는 getPosts를 호출한다 라는 의미.
// 즉, 클라이언트의 요청이 들어오게 되면 postsController클래스에서 정의된 getPosts메서드를 실행하도록 설정한것.
router.get("/", postsController.getPosts);

/** 게시글 작성 API **/
router.post("/", postsController.createPost);

export default router;
