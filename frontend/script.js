// 실제 Render 배포된 백엔드 API 주소
const API_URL = 'https://todo-app-qfco.onrender.com/api/todos';

// DOM 요소 선택
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const statusMsg = document.getElementById('statusMessage');

// 상태 메시지 표시 유틸 함수
function showMessage(msg, type = 'info') {
  statusMsg.textContent = msg;
  statusMsg.style.color = type === 'error' ? 'var(--danger)' : 'var(--text-sub)';
  
  // 3초 뒤에 메시지 지우기 (로딩 중이 아닐 때만)
  if (msg !== '데이터를 불러오는 중입니다... 🔄') {
    setTimeout(() => {
      statusMsg.textContent = '';
    }, 3000);
  }
}

// 1. 처음 화면 켤 때 할 일 목록 불러오기 (Read - GET)
async function fetchTodos() {
  showMessage('데이터를 불러오는 중입니다... 🔄');
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('데이터 불러오기 실패');
    
    const todos = await res.json();
    renderTodos(todos);
    showMessage('데이터 로드 완료! ✨');
  } catch (error) {
    console.error(error);
    showMessage('서버 연결에 실패했습니다. (새로고침 해주세요)', 'error');
  }
}

// 2. 새로운 할 일 추가하기 (Create - POST)
async function addTodo() {
  const title = todoInput.value.trim();
  if (!title) {
    showMessage('내용을 입력해주세요!', 'error');
    todoInput.focus();
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title })
    });

    if (!res.ok) throw new Error('추가 실패');
    
    todoInput.value = ''; // 입력창 비우기
    fetchTodos(); // 전체 데이터 다시 불러와서 깔끔하게 그리기
  } catch (error) {
    showMessage('추가 중 에러가 발생했습니다.', 'error');
  }
}

// 3. 할 일 완료 상태 바꾸기 (Update - PUT)
async function toggleTodo(id, currentStatus) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentStatus })
    });

    if (!res.ok) throw new Error('업데이트 실패');
    fetchTodos();
  } catch (error) {
    showMessage('상태 변경 중 에러가 발생했습니다.', 'error');
  }
}

// 4. 할 일 삭제하기 (Delete - DELETE)
async function deleteTodo(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error('삭제 실패');
    fetchTodos();
  } catch (error) {
    showMessage('삭제 중 에러가 발생했습니다.', 'error');
  }
}

// 화면에 리스트 그리는 함수 (렌더링)
function renderTodos(todos) {
  todoList.innerHTML = ''; // 기존 목록 싹 지우기

  if (todos.length === 0) {
    todoList.innerHTML = `
      <li style="text-align:center; padding: 20px; color: var(--text-sub);">
        등록된 할 일이 없네요! 새로 추가해볼까요? 📝
      </li>
    `;
    return;
  }

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    // 왼쪽 텍스트와 체크부분
    const contentDiv = document.createElement('div');
    contentDiv.className = 'todo-content';
    contentDiv.onclick = () => toggleTodo(todo._id, todo.completed);
    
    // 체크박스 (FontAwesome 아이콘 활용)
    const checkIcon = document.createElement('div');
    checkIcon.className = 'custom-checkbox';
    checkIcon.innerHTML = `<i class="fa-solid fa-check"></i>`;

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.title;

    contentDiv.appendChild(checkIcon);
    contentDiv.appendChild(span);

    // 오른쪽 삭제 버튼
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
    deleteBtn.onclick = (e) => {
      e.stopPropagation(); // 클릭 이벤트가 부모(완료/취소)로 번지는 것 막기
      deleteTodo(todo._id);
    };

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// 이벤트 리스너 등록
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

// 시작할 때 데이터 불러오기 실행
fetchTodos();
