//exports에 속성을 추가 - 모듈에서 접근
//express를 새로운 대체로 하면 일반 js 변수로 취급됨.
//exports는 module.exports를 생략한 것. 


//module.exports에 새로운 객체를 대체해야한다.
//새로운 객체로  대체할 경우에는 명시적으로 module.exports 지정.
module.exports = {
    getUser : function() {
        return {id:'test01', name:'방탄소년단'}
    }, 
    group : {id:'group01', name:'친구'}
}