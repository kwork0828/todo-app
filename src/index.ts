import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Todo from './models/Todo';

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

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Todo API is running!' });
});

// 할 일 등록 (Create)
app.post('/api/todos', async (req: Request, res: Response): Promise<any> => {
  try {
    const { title } = req.body;
    
    // 유효성 검사: 제목이 없을 경우 400 에러 반환
    if (!title) {
      return res.status(400).json({ message: '할 일의 제목(title)을 입력해주세요.' });
    }

    // DB에 저장할 새 인스턴스 생성
    const newTodo = new Todo({ title });
    
    // 실제 저장 수행
    const savedTodo = await newTodo.save();
    
    // 저장된 데이터 응답
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('할 일 저장 중 오류 발생:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 할 일 목록 조회 (Read)
app.get('/api/todos', async (req: Request, res: Response): Promise<any> => {
  try {
    // 생성된 시간 역순(최신순)으로 테이블(Todo) 데이터 가져오기
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: '할 일 목록을 가져오는 데 실패했습니다.' });
  }
});

// 할 일 완료 상태 수정 (Update)
app.put('/api/todos/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed },
      { new: true } // 업데이트 후의 최신 데이터 반환
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: '해당 할 일을 찾을 수 없습니다.' });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: '할 일 수정 중 오류가 발생했습니다.' });
  }
});

// 할 일 삭제 (Delete)
app.delete('/api/todos/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: '해당 할 일을 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '할 일이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '할 일 삭제 중 오류가 발생했습니다.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
