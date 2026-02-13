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

    return (
        <div className="post-list-container">
            {/* 상단 헤더 영역 */}
            <div className="list-header">
                <h2>Feeds</h2>
                
                <div className="search-wrapper">
                    {!nameParam && (
                        <>
                            <select value={searchField} onChange={handleFieldChange}>
                                <option value="title">제목</option>
                                <option value="username">작성자</option>
                            </select>
                            <input 
                                type="text" 
                                value={searchValue} 
                                onChange={handleInputChange} 
                                placeholder="Search posts..." 
                            />
                            <button className="search-btn" onClick={handleSearchClick}>검색</button>
                        </>
                    )}
                    {!nameParam && (
                        <button className="btn-new-post" onClick={createPost}>
                            + New Post
                        </button>
                    )}
                </div>
            </div>

            {message && <div className="alert alert-warning">{message}</div>}

            <table className="post-table">
                <thead>
                    <tr>
                        <th width="100">Image</th>
                        <th style={{ textAlign: 'left' }}>Post Title</th>
                        <th width="120">Author</th>
                        <th width="120">Date</th>
                        <th width="180">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post.id} className="post-row">
                            <tr key={post.id} className="post-row">
                            <td style={{ width: post.thumbFilePath ? '80px' : '0px', padding: post.thumbFilePath ? '15px' : '0px' }}>
                                {post.thumbFilePath && (
                                    <img 
                                        src={post.thumbFilePath} 
                                        className="post-thumb" 
                                        alt="thumbnail" 
                                    />
                                )}
                            </td>
                        </tr>
                            <td style={{ textAlign: 'left' }}>
                                <Link to={`/post/content/${post.id}`} className="post-title-link">
                                    {post.title}
                                </Link>
                            </td>
                            <td style={{ color: '#555' }}>{post.username}</td>
                            <td style={{ color: '#888', fontSize: '0.9rem' }}>
                                {new Date(post.uploadDate).toLocaleDateString('ko-KR')}
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                    {username === post.username && (
                                        <>
                                            <button className="btn-edit" onClick={() => updatePost(post.id)}>Edit</button>
                                            <button className="btn-delete" onClick={() => deletePost(post.id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}