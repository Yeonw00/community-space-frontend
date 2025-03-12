export default function SignButton({sign, inputMethod}) {
    return (
        <div>
            <button className="signButton"
            onClick={() => inputMethod(sign)}
            >{sign}</button> 
        </div>
    )
}