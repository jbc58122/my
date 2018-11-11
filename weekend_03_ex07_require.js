//클래스를 대체 시키면서 모듈에 익스폴트에 클래스가 저장한다.
var User = require('./weekend_03_ex07_exports_class.js');

//인스턴스 생성 후 사용.
var user = new User('test02', '줌마시대');

console.log(user);
console.log(user.group.name);