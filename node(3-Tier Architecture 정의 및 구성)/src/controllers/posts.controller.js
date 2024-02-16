/** 프레젠테이션 계층(Presentation Layer) **/
/* 특징
    - 3계층 아키텍처 패턴에서 가장 먼저 클라이언트의 요청(Request)을 만나게 되는 계층이며, 대표적으로 컨트롤러(Controller)가 이 역할을 담당
    - 하위 계층(서비스 계층, 저장소 계층)에서 발생하는 예외(Exception)를 처리
    - 클라이언트가 전달한 데이터에 대해 유효성을 검증하는 기능을 수행(Joi라이브러리를 이용한 유효성 검사)
    - 클라이언트의 요청을 처리한 후 서버에서 처리된 결과를 반환(Response)
*/

/** Controller **/
/* 특징
    - 컨트롤러(Controller)란 클라이언트의 요청(Request)을 처리하고, 서버에서 처리된 결과를 반환(Response)하는 역할을 담당
    - 클라이언트의 요청(Request)을 수신
    - 요청(Request)에 들어온 데이터 및 내용을 검증
    - 클라이언트의 요청(Request)을 서비스 계층으로 전달하는 역할을 수행
    - 서버에서 수행된 결과를 클라이언트에게 반환(Response)
    - 컨트롤러는 하위 계층의 내부 구조에 대해신경쓰지 않고 외부에 공개된 메서드를 호출하기만 함. 추상화의 특성 덕분!!
    - 서비스 계층이 어떠한 내부 구조를 통해 비즈니스 로직을 수행하는지는 상위 계층인 컨트롤러에게는 중요하지 않음
*/

import { PostsService } from "../services/posts.service.js";

// Post의 컨트롤러(Controller)역할을 하는 클래스
//
export class PostsController {
  // 전달된 요청(Request)을 처리하기 위해 PostsService를 호출
  // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.
  postsService = new PostsService();

  getPosts = async (req, res, next) => {
    try {
      // 서비스 계층에 구현된 findAllPosts 로직을 실행합니다.
      const posts = await this.postsService.findAllPosts();

      return res.status(200).json({ data: posts });
    } catch (err) {
      next(err);
    }
  };

  createPost = async (req, res, next) => {
    try {
      const { nickname, password, title, content } = req.body;

      // 서비스 계층에 구현된 createPost 로직을 실행합니다.
      const createdPost = await this.postsService.createPost(
        nickname,
        password,
        title,
        content
      );

      return res.status(201).json({ data: createdPost });
    } catch (err) {
      next(err);
    }
  };
}
