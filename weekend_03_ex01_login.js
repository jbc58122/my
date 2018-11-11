//weekend_03_ex01_login.js
// 기본 모듈
var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var static = require('serve-static');
var util = require('util');

// 세션, 쿠키, 로그인 관련 모듈
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 에러 처리 관련 모듈
var errorHandler = require('errorhandler');
var expressErrorHandler = require('express-error-handler');

// 라우팅 매핑을 위한 모듈
var router = express.Router();

app.set('port', process.env.PORT || 3000);

// 미들웨어 지정
app.use('/public', static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//쿠키 세션 미들웨어
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialzed: true,
}));

function print(req, res, msg) {
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>로그인 성공</h2>');
      res.write('<h2>로그인 성공</h2>');
      res.write('<a href="/public/product.html">상품페이지</a>')
      res.end();
}

router.route('/process/login').post(function(req,res) {
    console.log('/process/login 요청 들어옴');
    
    var paramId = req.body.id || req.query.id;
    var paramPwd = req.body.password || req.query.password;
    
    var msg = util.format('paramId:%s, paramPwd:%s', paramId, paramPwd);
    
    console.log(msg);
    if(req.session.user) {
      var hrtmlTag = 
            '<h2>로그인돼있음</h2>'+
            '<p>'+msg+'</p>'+
            '<a href="/public/product.html">상품페이지</a>'
          
      console.log('이미 로그인 되어있다')
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>이미 로그인 되어있음</h2>');
      res.write('<a href="/public/product.html">상품페이지</a>')
      res.end();
        
    } else {
        //로그인 안돼있으면 세션에 저장
        req.session.user = {
            id: paramId,
            name: '소년시대',
            authorized: true
        };
        var htmlTag =
            '<h2>로그인성공</h2>'+
            '<p>'+msg+'</p>'+
            '<a href="/public/product.html">상품페이지</a>'
        
        print(res, res, htmlTag);
    }
    
});

router.route('/process/logout').get(function(req, res) {
        if(req.session.user) {
            req.session.destory(function(err) {
                if(err) {
                    throw err;
                }
            });
        }
        var htmlTag =
            '<h2>로그아웃 되었습니다.</h2>'+
            '<a href="/public/logout.html">로그인</a>';
        print(req, res, htmlTeg);
        
});

app.use("/", router);

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log("http://localhost:%d", app.get('port'));
});