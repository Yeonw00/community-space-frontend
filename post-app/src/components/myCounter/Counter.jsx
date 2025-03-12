import NumberButton from "./NumberButton"
import './Counter.css'
import SignButton from "./SignButton"
import ResetButton from "./ResetButton"
import ResultWindow from "./ResultWindow"
import { useState } from "react"
import ResultButton from "./ResultButton"
import { evaluate } from "mathjs";

export default function Counter() {
    
    const [inputValue, setInputValue] = useState("")

    const [isResult, setIsResult] = useState(false); // 계산 결과 여부


    // 숫자 버튼 및 기호 클릭 시 상태 업데이트
    const inputNumber = (number) => {
        setInputValue((prev) => {
            
            // 결과가 표시된 상태라면 새로운 입력으로 기존 값 초기화
            if(isResult) {
                setIsResult(false) // 결과 상태 해제
                return number; // 기존 값 무시하고 새로운 숫자로 초기화
            }
            
            // 새로운 값 계산
            let newValue = prev + number;

            // 앞부분의 불필요한 0 제거 (ex: "0005" -> "5")
            if (/^0\d/.test(newValue)) {
                newValue = newValue.replace(/^0+/, ""); // 앞의 0들을 제거
            }
    
            return newValue;
        })
    }

    // 초기화 버튼 동작
    const resetInput = () => {
        setInputValue("")
    }

    // 결과 표시 로직 
    const calculateResult = () => {
        try {
            // 안전한 수식 변환
            const sanitizedExpression = inputValue
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
            
            // 유효한 수식인지 검증 (부호가 연속되거나 잘못된 위치에 있는 경우 방지)
            if (!/^[-+*/.\d\s()]+$/.test(sanitizedExpression)) {
                throw new Error("Invalid expression");
            }


            // 라이브러리를 활용해 수식 평가
            const result = evaluate(sanitizedExpression)
            setInputValue(String(result))
            setIsResult(true) // 결과 상태 활성화
        } catch (error) {
            setInputValue("")
            setIsResult(false) // 오류 시 결과 상태 해제
        }
    }


    return (
        <div>
            <ResultWindow count={inputValue}/>
            <div className="counterButtons ">
                <NumberButton by="7" inputMethod={inputNumber}/> 
                <NumberButton by="8" inputMethod={inputNumber}/> 
                <NumberButton by="9" inputMethod={inputNumber}/> 
                <SignButton sign="÷" inputMethod={inputNumber}/>
            </div>
            <div className="counterButtons ">
                <NumberButton by="4" inputMethod={inputNumber}/> 
                <NumberButton by="5" inputMethod={inputNumber}/> 
                <NumberButton by="6" inputMethod={inputNumber}/> 
                <SignButton sign="×" inputMethod={inputNumber}/>
            </div>
            <div className="counterButtons ">
                 <NumberButton by="1" inputMethod={inputNumber}/> 
                 <NumberButton by="2" inputMethod={inputNumber}/> 
                 <NumberButton by="3" inputMethod={inputNumber}/>
                 <SignButton sign="－" inputMethod={inputNumber}/>
            </div>
            <div className="counterButtons">
                <ResetButton resetMethod={resetInput}/>
                <NumberButton by={0} inputMethod={inputNumber}/>
                <ResultButton sign="=" resultMethod={calculateResult}/>
                <SignButton sign="+" inputMethod={inputNumber}/>
            </div>
        </div>
    )
}