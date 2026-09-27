# todo-app

> **상태: 완료 (학습용 소규모 프로젝트)**
> `tsc --noEmit` 타입체크 통과 확인 (2026-09-27). 테스트 코드는 없습니다.

할 일을 추가·완료 체크·삭제하는 간단한 Todo 웹앱입니다.
Express + MongoDB 백엔드를 Vercel 서버리스 함수로 배포하는 구조를 연습한 프로젝트입니다.

## 기능

| 기능 | API |
|---|---|
| 할 일 목록 조회 | `GET /api/todos` |
| 할 일 추가 | `POST /api/todos` (`title` 필수) |
| 완료 상태 변경 | `PUT /api/todos/:id` |
| 삭제 | `DELETE /api/todos/:id` |
| 서버 상태 확인 | `GET /api/health` |

## 기술 스택

- 프론트엔드: HTML, CSS, JavaScript (`public/`)
- 백엔드: Node.js, Express 5, TypeScript (`api/`)
- DB: MongoDB (Mongoose)
- 배포: Vercel (`vercel.json`에서 `/api/*`는 서버, 나머지는 `index.html`로 연결)

## 실행 방법

```bash
npm install
# .env 파일에 MONGO_URI 입력 (없으면 mongodb://localhost:27017/todoapp 사용)
npm run dev          # API 서버: http://localhost:5000
```

프론트엔드는 같은 도메인의 `/api/todos`를 호출하므로, 화면까지 함께 확인하려면
`npx vercel dev`로 실행하는 것이 가장 간단합니다.

`node check_db.js`를 실행하면 로컬 MongoDB에 저장된 데이터를 확인할 수 있습니다.

## 폴더 구조

```text
api/
├─ index.ts              # Express 앱, DB 연결, 라우터 등록
├─ models/Todo.ts        # title, completed, createdAt
└─ routes/todo.routes.ts # CRUD 라우터
public/                  # index.html, style.css, script.js
```

## 참고

- 기능을 확장한 후속 프로젝트는 [`TODO-`](https://github.com/kwork0828/TODO-) 저장소(할일플래너)입니다.
