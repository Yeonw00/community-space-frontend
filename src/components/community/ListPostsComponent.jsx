import { Link, useNavigate, useParams } from "react-router-dom"
import {  deletePostApi, retrieveAllPostsApi, retrieveAllPostsForUsernameApi, searchPostsByFieldApi } from "./api/PostApiService"
import { useCallback, useEffect, useState } from "react"
import { useAuth } from "./security/AuthContext"
import HeaderComponent from "./HeaderComponent"

export default function ListPostsComponent() {
    const authContext = useAuth()
    const username = authContext.username

    const {nameParam} = useParams()

    const navigate = useNavigate()

    const [posts, setPosts] = useState([])

    const [message, setMessage] = useState(null)
    
    const [searchValue, setSearchValue] = useState('')
    const [searchField, setSearchField] = useState('title') // 기본 검색 필드: 제목

    const refreshPosts = useCallback(
        () => {
            retrieveAllPostsApi()
            .then(response => {
                sortPosts(response.data)
            })
            .catch(error => console.log(error))
        },[]) 

        const refreshPostsForUsername = useCallback(
            (nameParam) => {
            retrieveAllPostsForUsernameApi(nameParam)
                .then(response => {
                    sortPosts(response.data)
                })
                .catch(error => console.log(error))
        },[])
    
    useEffect (
        () => {
            if(nameParam) {
                refreshPostsForUsername(nameParam)
            } else {
                refreshPosts()
            }
        }, [nameParam, refreshPosts, refreshPostsForUsername]
    )

    function sortPosts(newPosts) {
        const sortedPosts = [...newPosts].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        setPosts(sortedPosts);
    }

        
    function deletePost(id) {
        deletePostApi(id)
        .then(
            () => {
                //1: Display Message
                setMessage(`Delete of post with id = ${id} successful`)
                //2: Update Posts list
                if (nameParam) {
                    // /posts/:username 페이지일 경우
                    refreshPostsForUsername(nameParam)
                } else {
                    // /posts 페이지일 경우
                    refreshPosts()
                }
            }
        )
    }

    function updatePost(id) {
        if(nameParam) {
            navigate(`/post/${username}/${id}`)
        } else {
            navigate(`/post/${id}`)
        }
    }

    function createPost() {
    navigate(`/post/${-1}`)
    }

    const handleFieldChange = (e) => {
        setSearchField(e.target.value);  // 검색 필드 업데이트
    }

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);  // 검색어 업데이트
    }

    const handleSearchClick = async() => {
        if (searchValue.trim() !== '') {
            await searchPostsByFieldApi(searchField, searchValue)
            .then(response => {
                sortPosts(response.data)
            })
            .catch(error => console.log(error))
        }
    }

    const handleResetSearch = () => {
        setSearchValue('')
        setSearchField('title')
    }

    return(
        <div className="container">
            {!nameParam && 
            <div style={{ display: 'flex', alignItems:'center', gap: '10px', justifyContent: 'flex-end' }}>
                <select value={searchField} onChange={handleFieldChange} style={{ padding: '8px', fontSize: '16px' }}>
                    <option value="title">제목</option>
                    <option value="description">내용</option>
                    <option value="username">작성자</option>
                </select>
                <input type="text" value={searchValue} onChange={handleInputChange} placeholder="검색어를 입력하세요"
                    style={{ padding: '8px', fontSize: '16px', width: '300px' }}/>
                <button onClick={handleSearchClick} style={{ padding: '8px 12px', fontSize: '16px' }}>
                    검색
                </button>
            </div>}
            <br/>
            {message && <div className="alert alert-warning">{message}</div>}
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th style={{textAlign: 'left'}}>Title</th>
                            <th>User</th>
                            <th>Upload Date</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            posts.map(
                                post => (
                                    <tr key={post.id}>
                                        <td>
                                        {post.thumbFilePath &&(<img src={post.thumbFilePath} alt="Thumbnail" />)}

                                        </td>
                                        <td>
                                        <div style={{ textAlign: 'left' }}>
                                            <Link  to={`/post/content/${post.id}`} className="post-link" >
                                                {post.title}
                                            </Link>
                                        </div>
                                        </td>
                                        <td>{post.username}</td>
                                        <td>{new Date(post.uploadDate).toLocaleDateString('en-CA')}</td>
                                        <td>
                                            {username === post.username &&
                                                <button className="btn btn-success" onClick={() => updatePost(post.id)}>Edit</button>
                                            }
                                            </td>
                                        <td>
                                            {username === post.username &&
                                                <button className="btn btn-warning" onClick={() => deletePost(post.id)}>Delete</button>
                                            }
                                        </td>
                                    </tr>
                                )
                            )
                        }
                        
                    </tbody>
                </table>
            </div>
            {!nameParam && <div className="btn btn-success m-5" onClick={createPost}>New Post</div>}
        </div>
    )
}