// src/middlewares/log.middleware.js

/* 로그 미들웨어(Log Middleware)

   • 클라이언트의 모든 요청 사항을 기록하여 서버의 상태를 모니터링하기 위한 미들웨어입니다. 
   • 로그 미들웨어는 클라이언트의 요청을 기록하여 어플리케이션을 모니터링하고 문제가 발생할 때 빠르게 진단할 수 있습니다.
   • 로그 데이터는 사용자의 행동을 분석하는 등 데이터 분석 작업에도 활용할 수 있습니다.
   • 규모가 큰 프로젝트를 진행하게 되면, 화면에 표시되는 모든 로그를 일일이 확인하는 것은 불가능에 가깝기 때문에
     로그 기능을 지원하는 morgan, winston과 같은 라이브러리를 사용하거나 AWS CloudWatch, Datadog와 같은 외부 모니터링 솔루션 서비스를 이용해 로그를 수집하거나 관리할 수 있습니다.
     → 최근에는 Datadog과 같은 서비스를 이용해 로그 수집, 로그 분석과 같은 서비스를 전문 지식 없이 빠르게 구현할 수 있습니다.
*/

import winston from "winston";

const logger = winston.createLogger({
  level: "info", // 로그 레벨을 'info'로 설정합니다.                             // 로그 레벨(level)은 로그의 중요도를 나타냅니다.
  format: winston.format.json(), // 로그 포맷을 JSON 형식으로 설정합니다.        // 단순히 클라이언트의 요청 사항을 기록하기 위해 “info” 레벨을 사용
  transports: [
    new winston.transports.Console(), // 로그를 콘솔에 출력합니다.              // “error”, “warn”, “debug"등 다양한 로그 레벨이 있으며, 특정 상황에 따라 출력하는 레벨을 다르게 구현할 수 있습니다.
  ],
});

export default function (req, res, next) {
  // 클라이언트의 요청이 시작된 시간을 기록합니다.
  const start = new Date().getTime();

  // 응답이 완료되면 로그를 기록합니다.
  res.on("finish", () => {
    const duration = new Date().getTime() - start;
    logger.info(
      `Method: ${req.method}, URL: ${req.url}, Status: ${res.statusCode}, Duration: ${duration}ms`
    );
  });

  next();
}
