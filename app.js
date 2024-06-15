// express 모듈을 불러옵니다.
import express from 'express';
// 웹브라우저에서 보낸 데이터를 받아서 처리하는 body-parser를 불러온다.
import bodyParser from 'body-parser';
// express 애플리케이션을 생성합니다.
const app = express();
// 웹 서버가 사용할 포트 번호를 정의합니다.
const port = 3000;

import path from 'path';
const __dirname = path.resolve();


// import session from 'express-session';

// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: true
// }));

app.use('/views', express.static(__dirname+'/views'));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(express.json()); //json방식

import cookieParser from "cookie-parser";
app.use(cookieParser());

// 브라우저에서 오는 응답이 json 일수도 있고, 아닐 수도 있으므로 urlencoded() 도 추가한다.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get('/login', (req, res) => {
  res.clearCookie('connect.sid');
  res.sendFile(__dirname+'/views/login.html');
});
app.get('/viewlist', (req, res) => {
  res.sendFile(__dirname+'/views/viewlist.html');
});
// app.get('/postview', (req, res) => {
//   res.sendFile(__dirname+'/views/postview.html');
// });
app.get('/postview/:id', (req, res) => {
  // res.sendFile(__dirname+'/views/postview.html');
  res.render("postview", {id :req.params.id});
});
// app.get('/editpost', (req, res) => {
//   res.sendFile(__dirname+'/views/editpost.html');
// });
app.get('/editpost/:id', (req, res) => {
  // res.sendFile(__dirname+'/views/postview.html');
  res.render("editpost", {id :req.params.id});
});
app.get('/writepost', (req, res) => {
  res.sendFile(__dirname+'/views/writepost.html');
});
app.get('/joinmember', (req, res) => {
  res.sendFile(__dirname+'/views/joinmember.html');
});
app.get('/editprofile', (req, res) => {
  res.sendFile(__dirname+'/views/editprofile.html');
});
app.get('/editpwd', (req, res) => {
  res.sendFile(__dirname+'/views/editpwd.html');
});
app.get('/logout', (req, res) => {
  res.clearCookie('connect.sid');
  res.sendFile(__dirname+'/views/login.html');
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});