import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { uploadPhotoApi } from './api/PostApiService';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './security/AuthContext';
import { deletephotoApi } from './api/UploadFileApiService';

export default function WelcomeComponent() {
    const authContext = useAuth()
    const userId = authContext.userId

    const navigate = useNavigate()

    const {nameParam} = useParams()
    const [file, setFile] = useState(null);
    const [uuid, setUuid] = useState('')
    const [imageUrl, setImageUrl] = useState(null)
    const [date, setDate] = useState(null)
    const [change, setChange] = useState(false)

    useEffect(() => {
        if (userId) {
            const storedData = localStorage.getItem(`imageData_${userId}`);
            if (storedData) {
                setImageUrl(JSON.parse(storedData).imageUrl);
                setUuid(JSON.parse(storedData).uuid)
                setDate(JSON.parse(storedData).date)
            }
        }
    }, [userId]);

    // 파일 선택 이벤트 처리
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    // 업로드 버튼 클릭 이벤트 처리
    const handleUpload = async (event) => {
        event.preventDefault() // 기본 form 제출 방지
        if (!file) {
            alert('please select a file!')
            return
        }

        if(imageUrl) {
            console.log('기존 이미지 삭제')
            setChange(true)
            deleteImage()
        }

        // UUID 생성
        const uniqueId = uuidv4()
        setUuid(uniqueId)

         // 파일 정보 추출
         const fileName = file.name
         const type = file.type
         const size = file.size

        // FormData에 파일과 추가 정보를 포함
        const formData = new FormData()
        formData.append('file', file)
        formData.append('fileName', fileName)
        formData.append('uuid', uniqueId)
        formData.append('username', nameParam)
        formData.append('type', type)
        formData.append('size', size)

        try {
            const response = await uploadPhotoApi(formData) // API 호출
            setDate(response.data.date)
            setImageUrl(response.data.filePath)
            saveImageUrl(response.data.filePath, response.data.date, response.data.uuid); // 이미지 URL 저장
        } catch (error) {
            console.error('Upload error:', error)
        }
    }

    const saveImageUrl = (url, uploadDate, uniqueKey) => {
        setImageUrl(url);
        localStorage.setItem(`imageData_${userId}`, JSON.stringify({ imageUrl: url, date: uploadDate, uuid: uniqueKey }));
    }

    function deleteImage() {
        if (!date || !uuid) {
            alert('No uploaded image to delete.');
            return;
        }

        deletephotoApi(date, uuid)
            .then(() => {
                if(change) {
                    navigate(`/welcome/${nameParam}`)
                    setChange(false)
                } else {
                    setImageUrl(null)
                    navigate(`/welcome/${nameParam}`)
                }
            }
            )
            .catch(error => console.log(error))
    }

    return(
        <div className="WelcomeComponent">
            <h1>Welcome to {nameParam}'s home</h1>
            <br />
            <h4>upload a photo</h4>
            <form onSubmit={handleUpload}>
                <input type="file" name="file" accept="image/*" onChange={handleFileChange} required />
                <button type="submit" className="login-button m-2">Upload</button>
                {setImageUrl && <button type="button" className="login-button" onClick={deleteImage}>Delete</button>}
            </form>
            {imageUrl &&
                <img src={imageUrl} alt="Uploaded" style={{ width: '500px', height: 'auto' }} />
            }
        </div>
    )
}