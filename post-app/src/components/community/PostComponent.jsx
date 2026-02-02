import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { createPostApi, retrievePostApi, updatePostApi, uploadPhotoApi } from "./api/PostApiService"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { useAuth } from "./security/AuthContext"
import { v4 as uuidv4 } from 'uuid'

export default function PostComponent() {

    const authContext = useAuth()
    const username = authContext.username

    const { nameParam, id } = useParams();
    const navigate = useNavigate()

    const [uploadDate, setUploadDate] = useState(null)
    const [file, setFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [initialValues, setInitialValues] = useState({
        title: '',
        description: '',
        imagePreview: null,
    });
    const [uploads, setUploads] = useState([])
    const location = useLocation()

    useEffect(() => {
        console.log('Location state:', location.state);
        if(id !== -1) {
            retrievePostApi(id)
                .then(response => {
                    setUploadDate(response.data.uploadDate)
                    setUploads(response.data.uploads)
                    if (response.data.uploads && response.data.uploads.length > 0) {
                        setImagePreview(response.data.uploads["0"].filePath);  // 첫 번째 파일 경로 설정
                    }
                    setInitialValues({
                        title: response.data.title,
                        description: response.data.description,
                        imagePreview: response.data.uploads[0]?.filePath || null,
                    })
                })
                .catch(error => console.log(error))
        } 
    }, [id])

    async function onSubmit(values) {
        if (file) {
            await handleUpload();  // 파일이 있을 때만 업로드 진행
        }
        const postForUpdate = {
            id: id,
            username: username,
            title: values.title,
            description: values.description, 
            uploadDate: uploadDate
        }

        const post = {
            title: values.title,
            description: values.description,
            username: username
        }

        if(id === "-1") {
            createPostApi(post)
                .then(response => {
                    navigate('/posts')
                    })       
                .catch(error => console.log(error))
        } else {
            updatePostApi(id, postForUpdate)
                .then(response => {
                    if(nameParam) {
                        navigate(`/posts/${nameParam}`)
                    } else {
                        const fromComponent = location.state?.from;  // location에서 state 정보 가져오기
                        console.log('fromComponent' + fromComponent)
                        if (fromComponent === 'ContentComponent') {
                            navigate(`/post/content/${id}`);  // ContentComponent에서 호출된 경우
                        } else {
                            navigate('/posts');  // 기본 경로
                        }
                    }
                })
                .catch(error => console.log(error))
        }
    }

    function validate(values) {
        let errors = {
            // description: 'Enter a valid description'
        }
        if(values.title.length<1)
            errors.description = 'Enter at least 1 character'

        if(values.description.length<10)
            errors.description = 'Enter at least 10 characters'

        return errors
    }

    // 업로드 버튼 클릭 이벤트 처리
    const handleUpload = async (event) => {
        // UUID 생성
        const uniqueId = uuidv4()

         // 파일 정보 추출
         const fileName = file.name
         const type = file.type
         const size = file.size

        // FormData에 파일과 추가 정보를 포함
        const formData = new FormData()
        formData.append('file', file)
        formData.append('fileName', fileName)
        formData.append('uuid', uniqueId)
        formData.append('username', username)
        formData.append('type', type)
        formData.append('size', size)
        formData.append('uploadInPost', true)

        try {
            await uploadPhotoApi(formData) // API 호출 
            .then(response => {
                console.log(response.data)
                })    
            .catch(error => console.log(error))
        } catch (error) {
            console.error('Upload error:', error)
        }
    }

    // 이미지 선택 시 미리보기
    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
            const previewUrl = URL.createObjectURL(selectedFile);
            setImagePreview(previewUrl)
        }
    }

    return (
        <div className="container">
            <br/>
            <div>
                <Formik initialValues = {initialValues}
                    enableReinitialize = {true}
                    onSubmit = {onSubmit}
                    validate = {validate}
                    validateOnChange = {false}
                    validateOnBlur = {false}
                >
                {
                    (props) => (
                        <Form>
                            <ErrorMessage 
                                name="description"
                                component="div"
                                className="alert alert-warning"
                            />
                            <fieldset className="form-group fw-bold text-black">
                                <label>Title</label>
                                <Field type="text" className="form-control" name="title"/>
                            </fieldset>
                            <fieldset className="form-group fw-bold text-black">
                                <label>Description</label>
                                <Field as="textarea" className="form-control description-field" name="description"/>
                            </fieldset>
                                {/* 이미지 미리보기 */}
                                <div className="image-preview">
                                    {imagePreview && <img src={imagePreview} alt="Preview" className="img-preview" />}
                                </div>
                            <fieldset className="form-group fw-bold text-black">
                                <label>Upload Image</label>
                                <input type="file" className="form-control" name="image" accept="image/*" onChange={handleImageChange}/>
                            </fieldset>
                            {/* <fieldset className="form-group">
                                <label>Birth Date</label>
                                <Field type="date" className="form-control" name="birthDate"/>
                            </fieldset> */}
                            <div>
                                <button className="btn btn-success m-5" type="submit">Save</button>
                            </div>
                        </Form>
                    )
                }
                </Formik>
            </div>
        </div>
    )
}