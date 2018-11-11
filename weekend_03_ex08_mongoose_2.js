var http = require('http');
var express = require('express');
var app = express();

var mongoose = require('mongoose');

app.set('port', process.env.PORT || 3000);

var database;
var UserSchema;
var UserModel;

function connectDB() {
    var dbUrl = 'mongodb://localhost:27017/local';

    //db연결 시도
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose error'));
    database.on('open', function () {
        console.log('데이터베이스에 연결되었습니다 : %s', dbUrl);

        //db연결이 되면 Schema와 Model을 생성한다.
        UserSchema = mongoose.Schema({
            id: String,
            name: String,
            password: String
        });
        //console.log(UserSchema);
        UserModel = mongoose.model('users', UserSchema);

        UserModel.find({
            id: 'test01',
            password: '12345'
        }, function (err, docs) {
            if (err) {
                throw err;
            }
            if (docs.length > 0) {
                console.log(docs[0].name);
            } else {
                console.log('없는 사용자입니다.');
            }
        });

    });

    //연결이 끊어지면 5초 후 재연결
    database.on('disconnected', function () {
        console.log('연결이 끊어졌습니다. 5초 후에 다시 연결합니다.');
        setTimeout(connectDB, 5000);
    });
};

var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log('http://localhost:%d', app.get('port'));
    connectDB();
});
