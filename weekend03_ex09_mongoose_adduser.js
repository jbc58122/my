//weekend03_ex01_login.js
//기본모듈
var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var static = require('serve-static');
var util = require('util');

//세션, 쿠키, 로그인 관련 모듈
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

//에러처리 관련 모듈
var errorHandler = require('errorhandler');
var expressErrorHandler = require('express-error-handler');

//라우팅 매핑을 위한 모듈
var router = express.Router();

//몽고DB모듈 준비
var MongoClient = require('mongodb').MongoClient;

var mongoose = require('mongoose');

app.set('port', process.env.PORT || 3000);

var database;
var UserSchema;
var UserModel;

//미들웨어 지정
app.use('/public', static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
//쿠키세션미들웨어
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

function print(req, res, msg) {
    res.writeHead('200', {
        'Content-Type': 'text/html;charset=utf8'
    });
    res.write(msg);
    res.end();
}

var db;

function connectDB() {
    var dbUrl = "mongodb://localhost:27017/local";
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose error.'));
    database.on('open', function () {
        console.log('db에 연결 되었습니다.', dbUrl);
        UserSchema = mongoose.Schema({
            id: String,
            name: String,
            password: String
        });

        UserModel = mongoose.model('users', UserSchema);
        //연결이 끊어지면 5초후에 재 연결.
        database.on('disconnected', function () {
            console.log('연결이 끊어졌습니다. 5초후에 다시 연결합니다.');
            setTimeout(connectDB, 5000);
        });
    });
}

function authUser(db, id, pwd, callback) {
    console.log('authUser() 함수 호출 됨 : %s/%s', id, pwd);

    // id와 pwd를 DB에서 검색
    UserModel.find({"id": id,"password": pwd}, function (err, docs) {
        console.log("docs.length => ", docs.length);
        if (err) {
            callback(err, null);
            return;
        }
        if (docs.length > 0) {
            console.log('아이디:%s, 비번:%s', id, pwd);
            callback(null, docs);
        } else {
            callback(null, null);
        }
    });
} // end of authUser

function addUser(db, userData, callback) {
    console.log('addUser 기능 실행');
    
    var user = new UserModel(userData);

    user.save(function (err) {
        if (err) {
            throw err;
        }
        console.log('사용자 추가 성공!');
        callback(null, user);
    });
}

router.route('/process/login').post(function (req, res) {
    console.log('/process/login 요청 들어 옴!');

    var paramId = req.body.id || req.query.id;
    var paramPwd = req.body.password || req.query.password;

    var msg = util.format('paramId:%s, paramPwd:%s', paramId, paramPwd);

    console.log(msg);
    if (req.session.user) {
        var htmlTag =
            '<h2>이미 로그인 되었음</h2>' +
            '<a href="/public/product.html">상품페이지</a>';
        print(req, res, htmlTag);
    } else {
        //세션에 저장
        if (database) {
            authUser(database, paramId, paramPwd, function (err, docs) {
                if (err) throw err;

                if (docs) {
                    req.session.user = {
                        id: paramId,
                        name: docs[0].name,
                        authorized: true
                    };
                    var htmlTag =
                        '<h2>로그인 성공</h2>' +
                        '<a href="/public/product.html">상품페이지</a>';
                    print(req, res, htmlTag);
                } else {
                    print(req, res, "<p>로그인 실패 : 사용자 없다.</p>");
                }
            });
        }

    }
});

router.route('/process/logout').get(function (req, res) {
    if (req.session.user) {
        req.session.destroy(function (err) {
            if (err) {
                throw err;
            }
        });
    }
    var htmlTag =
        '<h2>로그아웃 되었습니다.</h2>' +
        '<a href="/public/login.html">로그인</a>';
    print(req, res, htmlTag);
});

router.route('/process/adduser').post(function (req, res) {
    console.log('/process/adduser 처리');

    //전달 파라미터 확인
    var paramId = req.body.id || req.query.id;
    var paramPwd = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;

    var str = util.format('>>> id:%s, pwd:%s, name:%s', paramId, paramPwd, paramName);
    console.log(str);

    var userData = {
        "id": paramId,
        "password": paramPwd,
        "name": paramName
    }

    if (database) {
        addUser(database, userData, function (err, result) {
            if (err) {
                throw err;
            }

            if (result) {
                console.dir(result);
                print(req, res, '<h2>사용자 추가 성공! ' + str + '</h2>');
            } else {
                print(req, res, '<h2>사용자 추가 실패!</h2>');
            }
        });
    } else {
        print(req, res, '<h2>DB 접속 실패!!</h2>');
    }

});

app.use("/", router);

var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log("http://localhost:%d", app.get('port'));
    connectDB();
});
