export default function NumberButton({by, inputMethod}) {
    return(
        <div>
            <button className="numberButton"
            onClick={() => inputMethod(by)}>
            {by}</button>
        </div>
    )
}