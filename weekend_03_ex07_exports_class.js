/*//인스턴스를 exports 모듈로 만든다.
function User(id, name) {
    this.id = id;
    this.name = name;
}


//js에서 클래스 선언시 prototype객체를 이용.
User.prototype.getUser = function() {
    return {id:this.id, name:this.name};
}

User.prototype.group = {id:'group1', name:'친구'};

User.prototype.printUser = function() {
    console.log('user이름: %s, group이름: %s', this.name, this.group.name);
}

module.exports = User; //클래스 자체를 모듈로 대체*/



//ES6 문법으로 클래스 만들기
class People {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    showInfo() {
        console.log(this.id + "," + this.name);
    }
}


//let user = new People('test', '테스트');
//user.showInfo();

class User extends People {
    constructor(id, name) {
        super(id, name);
        this.group = {
            id: 'test',
            name: '가족'
        };
    }

}

module.exports = User


//let user = new User('hello', 'world');
//user.showInfo();
