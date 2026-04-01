import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import todoRouter from './routes/todo.routes'; // 분리된 Todo 라우터 가져오기

dotenv.config();

const app = express();
// 포트번호를 5000으로 설정합니다.
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB 연결 설정
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB 연결성공');
  })
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err);
  });

// 서버 상태 확인용 헬스체크 라우터
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Todo API is running!' });
});

// Todo CRUD 라우터 연결
// /api/todos 경로로 들어오는 요청을 모두 todoRouter가 처리합니다.
app.use('/api/todos', todoRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
