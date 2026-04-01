import { Router, Request, Response } from 'express';
import Todo from '../models/Todo';

// Express 라우터 인스턴스 생성
// index.ts에서 app.use('/api/todos', todoRouter) 형태로 연결됩니다.
const router = Router();

// =============================================
// 할 일 생성 (Create) - POST /api/todos
// =============================================
router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { title } = req.body;

    // 유효성 검사: 제목이 없을 경우 400 에러 반환
    if (!title) {
      return res.status(400).json({ message: '할 일의 제목(title)을 입력해주세요.' });
    }

    // DB에 저장할 새 인스턴스 생성 후 저장
    const newTodo = new Todo({ title });
    const savedTodo = await newTodo.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('할 일 저장 중 오류 발생:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// =============================================
// 할 일 목록 조회 (Read) - GET /api/todos
// =============================================
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    // 최신순(생성 시간 역순)으로 데이터 조회
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: '할 일 목록을 가져오는 데 실패했습니다.' });
  }
});

// =============================================
// 할 일 완료 상태 수정 (Update) - PUT /api/todos/:id
// =============================================
router.put('/:id', async (req: Request, res: Response): Promise<any> => {
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

// =============================================
// 할 일 삭제 (Delete) - DELETE /api/todos/:id
// =============================================
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
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

export default router;
