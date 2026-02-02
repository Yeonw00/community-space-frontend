import { Link } from 'react-router-dom'
import { useAuth } from './security/AuthContext'
import ListPostsComponent from './ListPostsComponent'

export default function HeaderComponent() {

    //const authContext = useContext(AuthContext)
    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated
    const username = authContext.username
    const userId = authContext.userId

    function logout() {
        authContext.logout()
    }

    // console.log(authContext.number)
    // console.log(authContext.isAuthenticated

    return(
        <header className="border-bottom border-light border-3 mb-5 p-2">
            <div className="container">
                <div className="row">
                    <nav className="navbar navbar-expand-lg">
                    {isAuthenticated && <Link className="navbar-brand ms-2 fs-2 fw-bold text-black" to={`/welcome/${username}`}>Home</Link>}
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                {isAuthenticated && <Link className="nav-link" to="/posts" >Posts</Link>}
                            </li>
                            <li className="nav-item">
                                {isAuthenticated && <Link className="nav-link" to={`/posts/${username}`}>My Posts</Link>}
                            </li>
                        </ul>
                    </div>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            {!isAuthenticated && <Link className="nav-link" to="/">Login</Link>}
                        </li>
                        <li className="nav-item">
                            {!isAuthenticated && <Link className="nav-link" to="/join">Join</Link>}
                        </li>
                        <li className="nav-item">
                            {isAuthenticated &&<Link className="nav-link" to={`/mypage/${userId}`}>My Page</Link>}
                        </li>
                        <li className="nav-item">
                            {isAuthenticated &&<Link className="nav-link" to="/logout" onClick={logout}>Logout</Link>}
                        </li>
                    </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}