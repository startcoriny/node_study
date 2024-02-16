/** 서비스 계층(Service Layer) **/
/* 특징
    - 다른 이름으로는 비즈니스 로직 계층(Business logic layer)은 아키텍처의 가장 핵심적인 비즈니스 로직을 수행하고 클라이언트가 원하는 요구사항을 구현하는 계층
    - 프레젠테이션 계층(Presentation Layer)과 데이터 엑세스 계층(Data Access Layer) 사이에서 중간 다리 역할을 하며, 서로 다른 두 계층이 직접 통신하지 않게 만들어 줌
    - 서비스(Service)는 데이터가 필요할 때 저장소(Repository)에게 데이터를 요청
    - 어플리케이션의 규모가 커질수록, 서비스 계층의 역할과 코드의 복잡성도 점점 더 커지게 됨
    - 어플리케이션의 핵심적인 비즈니스 로직을 수행하여 클라이언트들의 요구사항을 반영하여 원하는 결과를 반환해주는 계층
*/

/* 장점
    - 사용자의 유즈 케이스(Use Case)와 워크플로우(Workflow)를 명확히 정의하고 이해할 수 있도록 도와줌
    - 비즈니스 로직이 API 뒤에 숨겨져 있으므로, 서비스 계층의 코드를 자유롭게 수정하거나 리팩터링할 수 있다
    - 저장소 패턴(Repository Pattern) 및 가짜 저장소(Fake Repository)와 조합하면 높은 수준의 테스트를 작성할 수 있다
*/

/* 단점
    - 서비스 계층 또한 다른 추상화 계층이므로, 잘못 사용하면 코드의 복잡성을 증가시킬 수 있다
    - 한 서비스 계층이 다른 서비스 계층에 의존하는 경우, 의존성 관리가 복잡해질 수 있다
    - 서비스 계층에 너무 많은 기능을 넣으면 빈약한 도메인 모델(Anemic Domain Model)과 같은 안티 패턴이 생길 수 있다
    - 현업에서는 서비스 코드가 계속 확장되는 문제가 발생할 수 있다
*/

import { PostsRepository } from "../repositories/posts.repository.js";
export class PostsService {
  postsRepository = new PostsRepository();

  findAllPosts = async () => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const posts = await this.postsRepository.findAllPosts();

    // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
    posts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    // 저장소 계층에서 받은 데이터를 그대로 클라이언트에게 전달한다면,
    // 사용자의 비밀번호와 같은 민감한 정보까지 노출되는 보안 문제가 발생하여, 서버의 보안성이 떨어지는 결과발생
    return posts.map((post) => {
      return {
        postId: post.postId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };

  createPost = async (nickname, password, title, content) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const createdPost = await this.postsRepository.createPost(
      nickname,
      password,
      title,
      content
    );

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return {
      postId: createdPost.postId,
      nickname: createdPost.nickname,
      title: createdPost.title,
      content: createdPost.content,
      createdAt: createdPost.createdAt,
      updatedAt: createdPost.updatedAt,
    };
  };
}
