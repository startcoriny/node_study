import { PrismaClient } from "@prisma/client"; // Prisma를 사용하여 실제 데이터베이스와의 연결을 관리하는 객체 but 여러 라우터들이 추가된다면 라우터 갯수마다 데이터베이스와 연결하게 되는 문제발생
// 해결볍 : 하나의 파일에서 데이터베이스 커넥션을 관리하여 최초로 1번만 MySQL과 커넥션을 생성하도록 코드를 구현하면 됩니다.

const prisma = new PrismaClient({
  // Prisma를 이용해 데이터베이스를 접근할 때, SQL을 출력해줍니다.
  log: ["query", "info", "warn", "error"],

  // 에러 메시지를 평문이 아닌, 개발자가 읽기 쉬운 형태로 출력해줍니다.
  errorFormat: "pretty",
}); // PrismaClient 인스턴스를 생성합니다.

export default prisma;
