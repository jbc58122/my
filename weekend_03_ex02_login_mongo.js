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

// 몽고DB모듈 준비
var MongoClient = require('mongodb').MongoClient;



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
      res.write(msg);
      res.end();
}

var db;
function connectDB() {
    var dbUrl = "mongodb://localhost:27017";
    MongoClient.connect(dbUrl, function(err, client) {
       if(err) throw err;
        
        console.log('DB에 연결되었습니다.');
        db = client.db('local');
    });
}

function authUser(db, id, pwd, callback) {
    console.log('authUser() 함수 호출 됨 : %s/%s', id, pwd);
    
    //DB에서 users 컬렉션 참조하기
    var users = db.collection('users');
    
    // id와 pwd를 db에서 검색
    users.find({"id":id, "password":pwd}).toArray(function(err, docs) {
        console.log("docs.length => ", docs.length);
        if(err) {
            callback(err,null);
            return;
        } if (docs.length > 0) {
            console.log('아이디:%s, 비번:%s', id, pwd);
            callback(null, docs);
        } else {
            callback(null, null);
        }
    
    });
}

router.route('/process/login').post(function(req,res) {
    console.log('/process/login 요청 들어옴');
    
    var paramId = req.body.id || req.query.id;
    var paramPwd = req.body.password || req.query.password;
    
    var msg = util.format('paramId:%s, paramPwd:%s', paramId, paramPwd);
    
    console.log(msg);
    if(req.session.user) {
      var htmlTag = 
            '<h2>로그인돼있음</h2>'+
            '<p>'+msg+'</p>'+
            '<a href="/public/product.html">상품페이지</a>'
          
      console.log('이미 로그인 되어있다');
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>이미 로그인 되어있음</h2>');
      res.write('<a href="/public/product.html">상품페이지</a>')
      res.end();
        
    } else {
        //로그인 안돼있으면 세션에 저장
        if(db) {
            authUser(db, paramId, paramPwd, function(err, docs) {
                if(err) throw err;
                
                if(docs) {
                    req.session.user = {
                        id: paramId,
                        name: docs[0].name,
                        authorized: true
                    };
                    
                    var htmlTag =
                        '<h2>로그인성공</h2>'+
                        '<a href="/public/product.html">상품페이지</a>'
                    print(res, res, htmlTag);
                    
                } else {
                    print(res, res, "<p>로그인 실패 : 없는 계정입니다.</p>");
                }
            });
        }

    }
    
});

router.route('/process/logout').get(function(req, res) {
        if(req.session.user) {
            req.session.destroy(function(err) {
                if(err) {
                    throw err;
                }
            });
        }
        var htmlTag =
            '<h2>로그아웃 되었습니다.</h2>'+
            '<a href="/public/login.html">로그인</a>';
        print(req, res, htmlTag);
        
});

app.use("/", router);

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log("http://localhost:%d", app.get('port'));
    connectDB();
});