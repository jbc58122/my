
//exports 자체를 다른 객체로 변화시키면
//require로 불러와도 그냥 빈 객체{}가 된다.
var user1 = require('./weekend_03_ex05_esports');

console.log(user1); //그냥 {}이다.

console.log(user1.getUser().name);
console.log(user1.group.name);