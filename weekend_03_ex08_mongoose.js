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
    database.on('open', function() {
        console.log('데이터베이스에 연결되었습니다 : %s', dbUrl);
    });
    
    //연결이 끊어지면 5초 후 재연결
    database.on('disconnected', function() {
        console.log('연결이 끊어졌습니다. 5초 후에 다시 연결합니다.');
        setTimeout(connectDB, 5000);
    });
};

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('http://localhost:%d', app.get('port'));
    connectDB();
});