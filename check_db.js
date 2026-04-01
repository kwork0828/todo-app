const mongoose = require('mongoose');

// 로컬 몽고디비 연결
mongoose.connect('mongodb://localhost:27017/todoapp')
  .then(async () => {
    // 모든 할 일을 찾아서 출력
    const Todo = mongoose.model('Todo', new mongoose.Schema({}, { strict: false }));
    const todos = await Todo.find();
    console.log("=== MongoDB (todoapp DB) 에 저장된 전체 데이터 목록 ===");
    console.log(JSON.stringify(todos, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error("연결 에러:", err);
    process.exit(1);
  });
