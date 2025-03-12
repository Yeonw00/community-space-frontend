import {PropTypes} from 'prop-types'
import './Counter.css'

export default function CounterButton({by, incrementMethod, decrementMethod}) {

    return(
        <div className="Counter">
            <div>
                <button className="counterButton" 
                onClick={() => incrementMethod(by)}
                >+{by}</button>
                <button className="counterButton"
                onClick={() => decrementMethod(by)}
                >-{by}</button>
            </div>
        </div>
    ) 
}

CounterButton.propTypes = {
    by: PropTypes.number
}

//App.js 에서 Counter에 props를 안줬을 때 기본 값
// CounterButton.defaultProps = {
//     by: 1
// }