import { PrismaClient } from "@prisma/client";

// PrismaClient 인스턴스를 생성
export const prisma = new PrismaClient({
  // Prisma를 이용해 데이터베이스를 접근할 때, SQL을 출력해줍니다.
  log: ["query", "info", "warn", "error"],

  // 에러 메세지를 평문이 아닌, 개발자가 읽기 쉬운 형태로 출력해줍니다.
  errorFormat: "pretty",
});

// ===========================================================================================
// Prisma의 트랜잭션
// Prisma의 트랜잭션은 여러개의 쿼리를 하나의 트랜잭션으로 수행할 수 있는 Sequential트랜잭션과
// Prisma가 자체적으로 트랜잭션의 성공과 실패를 관리하는 Interactive 트랜잭션이 존재합니다.

/* Sequential 트랜잭션
   Prisma의 여러 쿼리를 배열([])로 전달받아, 각 쿼리들을 순서대로 실행하는 특징이 있습니다. 
   이러한 특징은 여러 작업이 순차적으로 실행되어야할 때 사용할 수 있습니다.
   Sequential 트랜잭션은 Prisma의 모든 쿼리 메서드뿐만 아니라, Raw Query도 사용할 수 있습니다.
*/
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // Sequential 트랜잭션은 순차적으로 실행됩니다.
// // 결과값은 각 쿼리의 순서대로 배열에 담겨 반환됩니다.
// const [posts, comments] = await prisma.$transaction([
//   prisma.posts.findMany(),
//   prisma.comments.findMany(),
// ]);

// // Sequential 트랜잭션은 순차적으로 실행됩니다.
// // Raw Quyery를 이용하여, 트랜잭션을 실행할 수 있습니다.
// const [users, userInfos] = await prisma.$transaction([
//   prisma.$queryRaw`SELECT * FROM Users`,
//   prisma.$queryRaw`SELECT * FROM UserInfos`,
// ]);

/* Interactive 트랜잭션 
   모든 비즈니스 로직이 성공적으로 완료되거나 에러가 발생한 경우 
   Prisma 자체적으로 COMMIT또는 ROLLBACK을 실행하여 트랜잭션을 관리하는 장점을 가지고 있습니다.
   트랜잭션 진행 중에도 비즈니스 로직을 처리할 수 있어, 복잡한 쿼리 시나리오를 효과적으로 구현할 수 있습니다.
   $transation() 메서드의 첫번째 인자 async(tx)는 prisma 인스턴스와 같은 기능을 수행합니다.
*/
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // Prisma의 Interactive 트랜잭션을 실행합니다.
// const result = await prisma.$transaction(async (tx) => {
//   // 트랜잭션 내에서 사용자를 생성합니다.
//   const user = await tx.users.create({
//     data: {
//       email: 'testuser@gmail.com',
//       password: 'aaaa4321',
//     },
//   });

//   // 에러가 발생하여, 트랜잭션 내에서 실행된 모든 쿼리가 롤백됩니다.
//   throw new Error('트랜잭션 실패!');
//   return user;
// });
