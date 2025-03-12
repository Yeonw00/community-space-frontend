import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deletePostApi, retrievePostApi } from "./api/PostApiService";

export default function ContentComponent() {
    const {id} = useParams()
    const [title, setTitle] = useState('')
    const [username, setUsername] = useState('')
    const [uploadDate, setUploadDate] = useState('')
    const [description, setDescription] = useState('')
    const [uploads, setUploads] = useState([])

    const navigate = useNavigate()

    const [fromComponent,setFromComponent] = useState(null)

   useEffect(() => {
        const fromStorage = localStorage.getItem('fromComponent');
        if (!fromComponent && fromStorage) {
            setFromComponent(fromStorage)
        }
        retrievePostApi(id)
            .then(response => {
                setTitle(response.data.title)
                setUsername(response.data.username)
                setDescription(response.data.description)
                setUploadDate(response.data.uploadDate)
                setUploads(response.data.uploads)
            })
            .catch(error => console.log(error))
    },[id])

    const handleEditClick = () => {
        navigate(`/post/${id}`, { state: { from: 'ContentComponent' } })
        localStorage.setItem('fromComponent', 'ContentComponent')
    }

    function deletePost(id) {
        deletePostApi(id)
        .then(() => {
            navigate('/posts')
        })
    }

    
    return (
        <div>
            <h3>{title}</h3>
            <hr/>
            <div className="content-container">
                <div>
                    <label>{username}</label>
                    <label>{new Date(uploadDate).toLocaleDateString('en-CA')}</label>
                </div>
            </div>
            <div className="content-container ">
                <button className="content-button" onClick={handleEditClick}>Edit</button>
                <button className="content-button" onClick={() => deletePost(id)}>Del.</button>
            </div>
            <br />
            <h4>{description}</h4>
            {uploads.length > 0 && (
                <div className="uploads">
                {uploads.map(upload => (
                    <img key={upload.id} src={upload.filePath} alt={upload.fileName} />
                ))}
                </div>
            )}
        </div> 
    )
}