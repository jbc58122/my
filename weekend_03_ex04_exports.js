// exports에 속성을 추가하고 함수나 객체를 지정
// 자바스크립트는 객체에 속성을 마음대로 추가할 수 있다.

//var user = {}; //이건 user객체 생성된 것.
//user.id = 'hong'; // 객체에 임의로 속성 추가가 가능.
//user.name = 'gildong';

//console.dir(user);


exports.getUser = function() {
    return {id:"test01", name:"소녀시대"};
}

exports.group = {id:'group1', name:'친구'}
console.dir(module.exports); //exports 객체에 속성을 추가한것.

