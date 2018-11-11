//인스턴스를 exports 모듈로 만든다.
function User(id, name) {
    this.id = id;
    this.name = name;
}


//js에서 클래스 선언시 prototype객체를 이용.
User.prototype.getUser = function () {
    return {
        id: this.id,
        name: this.name
    };
}

User.prototype.group = {
    id: 'group1',
    name: '친구'
};

User.prototype.printUser = function () {
    console.log('user이름: %s, group이름: %s', this.name, this.group.name);
}

module.exports = new User('test01', '소녀시대'); //인스턴스 생성
