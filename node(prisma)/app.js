import mysql from "mysql2";
import express from "express";
import PostsRouter from "./routes/posts.router.js";

const connect = mysql.createConnection({
  host: "express-database.cng0ogw623q8.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "aaaa4321",
  database: "express_db",
  port: 3308,
});

const app = express();
const PORT = 3003;

app.use(express.json());

// 데이터 생성 API row query
/** 테이블 생성 API **/
app.post("/api/tables", async (req, res, next) => {
  const { tableName } = req.body;
  await connect.promise().query(
    `CREATE TABLE ${tableName}(
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(20) NOT NULL,
            createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
  );
  return res.status(201).json({ message: "테이블 생성에 성공하였습니다." });
});

/** 테이블 조회 API **/
app.get("/api/tables", async (req, res, next) => {
  const [tableList] = await connect.promise().query(`show tables`);
  console.log(tableList);
  const tableNames = tableList.map((table) => Object.values(table));
  return res.status(201).json({ tableNames: tableNames });
});

/** 데이터 삽입 API **/
app.post("/api/tables/:tableName/items", async (req, res, next) => {
  const { tableName } = req.params;
  const { name } = req.body;

  await connect.promise().query(`
        INSERT INTO ${tableName} (name)
        VALUES ('${name}')`);
  return res.status(201).json({ message: "데이터 생성에 성공하였습니다." });
});

// 게시글 라우터
app.use("/api", [PostsRouter]);

app.listen(PORT, () => {
  console.log(`${PORT}번호로 서버가 연결되었습니다!`);
});
