
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { RegisterRoutes } from "./generated/routes";
import { AppError } from './common/errors/app.error.js';

// 1. 환경 변수 설정
dotenv.config();

const app: Express = express();
app.use((req: Request, res: Response, next: NextFunction) => {
  res.success = function ({ message = null, data = null }) {
    return this.json({
      resultType: "SUCCESS",
      error: null,
      success: {
        message,
      },
      data,
    });
  };

  res.error = function ({ errorCode = null, message = null, data = null }) {
    return this.json({
      resultType: "FAILED",
      error: { errorCode, message, data },
      data: null,
    });
  };

  next();
});

app.use(morgan('dev'));
app.use(cookieParser()); 

// const app=express();
// app.get('/test', (req, res) => {
//   res.send('Hello!');
// });

// // 쿠키 만드는 라우터 
// app.get('/setcookie', (req, res) => {
//     // 'myCookie'라는 이름으로 'hello' 값을 가진 쿠키를 생성
//     res.cookie('myCookie', 'hello', { maxAge: 60000 }); // 60초간 유효
//     res.send('쿠키가 생성되었습니다!');
// });

// // 쿠키 읽는 라우터 
// app.get('/getcookie', (req, res) => {
//     // cookie-parser 덕분에 req.cookies 객체에서 바로 꺼내 쓸 수 있음
//     const myCookie = req.cookies.myCookie; 
    
//     if (myCookie) {
//         console.log(req.cookies); // { myCookie: 'hello' }
//         res.send(`당신의 쿠키: ${myCookie}`);
//     } else {
//         res.send('쿠키가 없습니다.');
//     }
// });

const port = process.env.PORT || 3000;

// 2. 미들웨어 설정
app.use(cors());            // cors 방식 허용                 
app.use(express.static('public'));    // 정적 파일 접근      
app.use(express.json());              // request의 본문을 json으로 해석할 수 있도록 함(JSON 형태의 요청 body를 파싱하기 위함)     
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// 3. 기본 라우트
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is TypeScript Server!");
});

const router = express.Router();
RegisterRoutes(router); 
app.use("/api/v1", router);

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    message: err.message || null,
    data: err.data || null,
  });
});

// 4. 서버 시작
app.listen(port, () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);
});
