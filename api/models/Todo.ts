import mongoose, { Schema, Document } from 'mongoose';

// 1. TypeScript 인터페이스 정의: Todo 데이터가 어떤 형태인지 명시
export interface ITodo extends Document {
  title: string;
  completed: boolean;
  createdAt: Date;
}

// 2. Mongoose 스키마(데이터 구조) 정의
const TodoSchema: Schema = new Schema({
  title: { 
    type: String, 
    required: [true, '할 일의 제목은 필수입니다.'], // 제목은 반드시 입력되도록 강제
    trim: true // 앞뒤 공백 제거
  },
  completed: { 
    type: Boolean, 
    default: false // 생성 시 기본적으로 미완료(false) 상태
  },
  createdAt: { 
    type: Date, 
    default: Date.now // 자동 생성 시간 저장
  }
});

// 3. 'Todo'라는 이름의 컬렉션(테이블) 모델 생성 및 내보내기
export default mongoose.model<ITodo>('Todo', TodoSchema);
