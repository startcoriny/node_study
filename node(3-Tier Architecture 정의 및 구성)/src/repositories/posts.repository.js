/** 저장소 계층 (Repository Layer), 데이터 엑세스 계층(Data Access Layer) **/
/* 특징
    - 데이터베이스와 관련된 작업을 처리하는 계층
    - 데이터 접근과 관련된 세부 사항을 숨기는 동시에, 메모리상에 데이터가 존재하는 것처럼 가정하여 코드를 구현
    - 저장소 계층을 도입하면, 데이터 저장 방법을 더욱 쉽게 변경할 수 있고, 테스트 코드 작성시 가짜 저장소(Mock Repository)를 제공하기가 더 쉬워짐
    - 어플리케이션의 다른 계층들은 저장소의 세부 구현 방식에 대해 알지 못하더라도 해당 기능을 사용할 수 있음, 즉 저장소 계층의 변경 사항이 다른 계층에 영향을 주지 않는 것
        ★ 객체 지향의 개념 중 추상화(Abstraction)와 관계가 있다
    - 저장소 계층은 데이터 저장소를 간단히 추상화한 것으로, 이 계층을 통해 모델 계층과 데이터 계층을 명확하게 분리할 수 있다
    - 데이터베이스 관리 (연결, 해제, 자원 관리) 역할을 담당
    - 데이터베이스의 CRUD 작업을 처리

    대표적인 메서드
        ■ add(), create() : 새 원소를 저장소에 추가
        ■ get(), find() : 이전에 추가한 원소를 저장소에서 가져옴
*/

/* 장점
    - 데이터 모델과 데이터 처리 인프라에 대한 사항을 분리했기 때문에 단위 테스트(Unit test)를 위한 가짜 저장소(Mock Repository)를 쉽게 만들 수 있다
    - 도메인 모델을 미리 작성하여, 처리해야 할 비즈니스 문제에 더 잘 집중할 수 있게 됨
    - 객체를 테이블에 매핑하는 과정을 원하는 대로 제어할 수 있어서 DB 스키마를 단순화할 수 있다.
    - 저장소 계층에 ORM을 사용하면 필요할 때 MySQL과 Postgres와 같은 다른 데이터베이스로 쉽게 전환할 수 있다.
*/

/* 단점
    - 저장소 계층이 없더라도 ORM은 모델과 저장소의 결합도를 충분히 완화시켜 줄 수 있다
        • ORM이 없을 때 대부분의 코드는 Raw Query로 작성되어 있기 때문
    - ORM 매핑을 수동으로 하려면 개발 코스트가 더욱 소모됨
        • Prisma와 같은 라이브러리
*/

import { prisma } from "../utils/prisma/index.js";

export class PostsRepository {
  findAllPosts = async () => {
    // ORM인 Prisma에서 Posts 모델의 findMany 메서드를 사용해 데이터를 요청합니다.
    const posts = await prisma.posts.findMany();

    return posts;
  };

  createPost = async (nickname, password, title, content) => {
    // ORM인 Prisma에서 Posts 모델의 create 메서드를 사용해 데이터를 요청합니다.
    const createdPost = await prisma.posts.create({
      data: {
        nickname,
        password,
        title,
        content,
      },
    });

    return createdPost;
  };
}
