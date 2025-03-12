export default function ResultButton({sign,resultMethod}) {
    return (
        <div>
            <button className="signButton"
            onClick={resultMethod}
            >{sign}</button> 
        </div>
    )
}