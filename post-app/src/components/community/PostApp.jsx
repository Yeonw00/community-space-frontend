import './PostApp.css'

import { BrowserRouter, Routes,Route, Navigate } from 'react-router-dom'
import LogoutComponent from './LogoutComponent'
import HeaderComponent from './HeaderComponent'
import ListPostsComponent from './ListPostsComponent'
import ErrorComponent from './ErrorComponent'
import WelcomeComponent from './WelcomeComponent'
import LoginComponent from './LoginComponent'
import AuthProvider, { useAuth } from './security/AuthContext'
import PostComponent from './PostComponent'
import JoinComponent from './JoinComponent'
import MypageComponent from './MypageComponent'
import ContentComponent from './ContentComponent'


function AuthenticatedRoute({children}) {
    const authContext = useAuth()
    if(authContext.isAuthenticated) 
        return children

    return <Navigate to="/" />
}

export default function PostApp() {
    return(
        <div className="PostApp">
            <AuthProvider>
                <BrowserRouter>
                    <HeaderComponent />
                    <Routes>
                        <Route path='/' element={<LoginComponent />} />
                        <Route path='/login' element={<LoginComponent />} />
                        <Route path='/join' element={<JoinComponent />} />
                        <Route path='/welcome/:nameParam' element={
                            <AuthenticatedRoute>
                                <WelcomeComponent />
                            </AuthenticatedRoute>
                        }/>

                        <Route path='/posts' element={
                            <AuthenticatedRoute>
                                <ListPostsComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/posts/:nameParam' element={
                            <AuthenticatedRoute>
                                <ListPostsComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/post/:id' element={
                            <AuthenticatedRoute>
                                <PostComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/post/:nameParam/:id' element={
                            <AuthenticatedRoute>
                                <PostComponent />
                            </AuthenticatedRoute>
                        } />
                        
                        <Route path='/mypage/:userId' element={
                            <AuthenticatedRoute>
                                <MypageComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/logout' element={
                            <AuthenticatedRoute>
                                <LogoutComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/post/content/:id' element={
                            <AuthenticatedRoute>
                                <ContentComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='*' element={<ErrorComponent />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </div>
    )
}













