// 필요 모듈 선언
const express = require('express');
const http = require('http');
const ejs = require('ejs');
const app = express();

//express 서버 포트 설정
app.set('port', process.env.PORT || 3000);

// view 설정
app.set("view engine", "ejs");

//서버 생성
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

//라우팅 모듈 선언
var indexRouter = require('./routes/index');
var users = require('./routes/users');
var submit = require('./routes/submit');

//request 요청 URL과 처리 로직을 선언한 라우팅 모듈 매핑
app.use('/', indexRouter);
app.use('/users', users);
app.use('/submit', submit);