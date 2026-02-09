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

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Welcome Back</h1>
                <p className="subtitle">Please enter your details</p>

                {showErrorMessage && (
                    <div className="error-message">
                        Authentication Failed. Check your credentials.
                    </div>
                )}

                <div className="form-group">
                    <label>User Name</label>
                    <input 
                        type="text" 
                        placeholder="Enter your username"
                        value={username} 
                        onChange={handleUsernameChange}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="••••••••"
                        value={password} 
                        onChange={handlePasswordChange}
                    />
                </div>

                <button className="main-login-btn" onClick={handleSubmit}>
                    Login
                </button>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button 
                    className="google-login-btn" 
                    onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
                >
                    <img 
                        src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" 
                        alt="Google logo" 
                    />
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}