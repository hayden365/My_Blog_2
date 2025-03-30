### Server

POST /api/posts 게시글 생성 { title, slug, content } 생성된 게시글 객체  
GET /api/posts 모든 게시글 조회 없음 게시글 배열  
GET /api/posts/:slug 특정 게시글 조회 없음 해당 게시글 객체  
DELETE /api/posts/:slug 특정 게시글 삭제 없음 삭제 결과 or 삭제된 객체 정보  
  
post의 slug를 백엔드에서 생성
