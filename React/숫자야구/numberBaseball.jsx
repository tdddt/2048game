import React, {Component} from 'react';
import Try from './try';

//this를 안 쓰면 밖에 빼도 괜찮음
function getNumbers() { //랜덤 숫자 4개 (중복X)
    const candidate = [1,2,3,4,5,6,7,8,9];
    const array = [];
    for (let i=0;i<4;i++){
        const chosen = candidate.splice(Math.floor(Math.random()*(9-i)),1)[0];
        array.push(chosen);
    }
    return array;
}

//vsc 일괄선택 단축키 : alt + j

class NumberBaseball extends Component { 
    //화살표 함수를 쓰면 constructor 필요없음, 화살표 안 쓰면 this가 undefined돼서 constructor 써줘야 함
    state = {
        result:'',
        value:'',
        answer:getNumbers(), //[1,3,5,7]
        tries: [], //배열에 값 넣을 때 push 쓰면 안 됨
    };

    onSubmitForm = () => {
        const {value, tries, answer} = this.state;
        e.preventDefulat();
        if (value === answer.join('')){
            this.setState({
                result:'홈런!',
                //[기존 배열 복사, 새로운 값 넣어줌] -> react가 변화를 감지함
                tries: [...tries, {try: value, result:'홈런!'},]
            });
            alert('게임을 다시 시작합니다.');
            this.setState({
                value: '',
                answer: getNumbers(),
                tries: [],
            });
        } else { //오답일 경우
            const answerArray = value.split('').map((v)=>parseInt(v));
            let strike = 0;
            let ball = 0;
            if (tries.length >= 9) { //10번 이상 틀렸을 때
                this.setState({
                    result: `10번 만에 맞히지 못했습니다. 실패! 답은 ${answer.join(',')}였습니다!`,
                });
                alert('게임을 다시 시작합니다.');
                this.setState({
                    value: '',
                    answer: getNumbers(),
                    tries: [],
                });
            } else { //기회가 더 남아있는 경우
                for (let i=0;i<4;i+=1){
                    if(answerArray[i]===answer) {
                        strike += 1;
                    } else if (answer.includes(answerArray[i])){
                        ball += 1;
                    }
                }
                this.setState({
                    tries: [...tries, {try : value, result: `${strike} 스트라이크, ${ball} 볼입니다`}],
                    value: '',
                });

            }
        }
    };

    onChangeInput = (e) => {
        console.log(this.state.answer);
        this.setState({
            value: e.target.value,
        });
    };

    render() { /*html태그에서는 단어가 소문자지만, react에서는 대문자로 바꿔줘야 함*/
        const {result, value, tries} = this.state; //구조분해쓰면 return 부분에 반복 필요X
        return (
            <>
                <h1>{result}</h1>
                <form onSubmit={this.onSubmitForm}>
                    <input maxLength={4} value={value} onChange={this.onChangeInput}/>
                </form>
                <div>시도: {tries.length}</div>
                <ul>
                    {tries.map((v,i)=>{
                        return (
                            <Try key={`${i+1}차 시도:`} tryInfo={v}/> //props : tryInfo
                        );
                    })}
                    
                    {/*
                    이중 배열일 때는 v[0],v[1] 처럼 사용
                    key는 고유한 값을 가지고 있어야 함
                    화살표함수에서 {}를 없애면 return생략 가능
                    i는 index로 0부터 시작함. i를 key로 쓰면 성능최적화할 때 문제가 생기기 때문에 지양해야 함.
                        [
                        {fruit: '사과', taste:'맛있다'},
                        {fruit: '바나나', taste:'달다'}
                    ].map((v,i)=>{
                        return (
                            <li key={v.fruit+v.taste}>{v.fruit}-{v.taste}</li>
                        );
                    })*/}
                    
                    <li/>
                </ul>
            </>
        );
    }
}

export default NumberBaseball;