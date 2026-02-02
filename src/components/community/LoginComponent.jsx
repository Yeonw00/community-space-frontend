import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './security/AuthContext'

export default function LoginComponent() {

    const [username, setUsername] = useState('Odung')

    const [password, setPassword] = useState('')

    const [showErrorMessage, setShowErrorMessage] = useState(false)

    const navigate = useNavigate()

    const authContext = useAuth()

    function handleUsernameChange(event) {
        setUsername(event.target.value)
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value)
    }

    async function handleSubmit() {
        if(await authContext.login(username, password)) {
            navigate(`/welcome/${username}`)
        } else {
            setShowErrorMessage(true)
        }
    }

    return(
        <div className="LoginComponent">
            <h1>Time to Login!</h1>
            <br></br>
            {showErrorMessage && <div className="errorMessage">Authentication Failed. Please check your credentials.</div>}
            <div className="LoginForm">
                <div className="form-group">
                    <label>User Name:</label>
                    <input type="text" name="username" value={username} onChange={handleUsernameChange}/>
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <div className="password-row">
                        <input type="password" name="password" value={password} onChange={handlePasswordChange}/>
                        <button className="login-button" type="button" name="login" onClick={handleSubmit}>login</button>
                    </div>
                </div>
                {/* <br></br> */}
                {/* <div> */}
                {/* </div> */}
                <button onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}>
                    Google 로그인
                </button>

            </div>
        </div>
    )
}