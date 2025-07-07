### Server

POST /api/posts 게시글 생성 { title, slug, content } 생성된 게시글 객체  
GET /api/posts 모든 게시글 조회 없음 게시글 배열  
GET /api/posts/:slug 특정 게시글 조회 없음 해당 게시글 객체  
DELETE /api/posts/:slug 특정 게시글 삭제 없음 삭제 결과 or 삭제된 객체 정보

post의 slug를 백엔드에서 생성

{
"*id": "6867dc405280a6b003b32bf8",
"title": "project",
"language": "js",
"frontend_tech": [
"react"
],
"backend_tech": [
"mongodb"
],
"isGroupProject": false,
"myRole": "fe",
"description": "test",
"startDate": "2025-06-30T00:00:00.000Z",
"endDate": null,
"isOngoing": true,
"links": {
"github": "",
"notion": "",
"demo": "",
"figma": "",
"\_id": "6867dc405280a6b003b32bf9"
},
"coverImg": "https://ik.imagekit.io/d4xwcj148/스크린샷_2025-07-04*오후\_1.23.55_DBg_8MqVF.png",
"createdAt": "2025-07-04T13:50:56.151Z",
"\_\_v": 0
}
