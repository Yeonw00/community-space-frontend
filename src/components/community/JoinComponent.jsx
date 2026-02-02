import { Formik, Form, Field } from "formik";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserApi, retrieveUserByUsernameApi } from "./api/UserApiSerivce";

export default function JoinComponent () {

    const navigate = useNavigate()

    const [message, setMessage] = useState('')

    const [clicked, setClicked] = useState(false)

    const [availability, setAvailability] = useState(false)
    

    function checkAvailability (username) {
        setClicked(true)
        if(username === "") {
            alert('유저명을 입력해주세요')
            setClicked(false)
            setAvailability(false)
        } else{
            retrieveUserByUsernameApi(username)
            .then((response) => {
                setMessage('이미 사용중인 유저명입니다.')
                setAvailability(false)
            })
            .catch((error) => {
                setMessage('사용 가능한 유저명입니다.')
                setAvailability(true)
            })
        }
    }

    function onSubmit(values) {
        const user = {
            username: values.username,
            birthDate: values.birthDate,
            emailAddress: values.emailAddress, 
            phoneNumber: values.phoneNumber,
            isMale: values.gender
        }

        if(!clicked || !availability ) {
            alert("유저명을 확인하세요")
        } else {
            createUserApi(user)
                .then(response => {
                    navigate('/')
                    })       
                .catch(error => console.log(error))
        }
    }

    function validate(values) {
        let errors = {
            // description: 'Enter a valid description'
        }
        
        if(values.username.length<2)
            errors.description = 'Enter at least 2 characters'

         // birthDate가 과거 날짜인지 검증
        if (new Date(values.birthDate) >= new Date()) {
            errors.birthDate = 'Birth date must be in the past';
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(values.emailAddress)) {
            errors.emailAddress = 'Enter a valid email address';
        }

        // 전화번호 검증 (정규식 사용)
        const phoneRegex = /^[0-9]{10,11}$/; // 예시: 10자리 숫자 (국내 전화번호 기준)
        if (!phoneRegex.test(values.phoneNumber)) {
            errors.phoneNumber = 'Enter a valid phone number (10 digits)';
        }

    return errors;

    }

    return (
        <div className="container">
            <h1>Please Join Us!</h1>
            <br></br>
            <Formik initialValues={{ username: "", birthDate: "", emailAddress: "", phoneNumber: "", gender: "" }}
                    onSubmit = {onSubmit}
                    validate = {validate}
                    validateOnChange = {false}
                    validateOnBlur = {false}
            >
                {
                    (props) => (
                        <Form>
                            <fieldset className="JoinForm">
                                <div className="join-form-group">
                                    <label>User Name :</label>
                                    <Field type="text" className="form-control input-field" name="username" />
                                    <button className="join-button" type="button" onClick={() => checkAvailability(props.values.username)}>check</button>
                                </div >
                                    {clicked && <div style={{ color: 'red', fontSize: '11px'}}>{message}</div>}
                                <div className="join-form-group">
                                    <label>Birth Date :</label>
                                    <Field type="date" className="form-control input-field" name="birthDate" />
                                </div>
                                <div className="join-form-group">
                                    <label>E-mail :</label>
                                    <Field type="email" className="form-control input-field" name="emailAddress" />
                                </div >
                                <div className="join-form-group">
                                    <label>Phone :</label>
                                    <Field type="tel" className="form-control input-field" name="phoneNumber" />
                                </div>
                                <div className="join-form-group">
                                <label>Gender:</label>
                                    <div role="group" aria-labelledby="gender-group" className="radio-group">
                                        <label> Male
                                        <Field type="radio" name="gender" value="male" checked/>
                                        </label>
                                        <label> Female
                                        <Field type="radio" name="gender" value="female" />
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                            <button className="join-button" type="submit">Join</button>
                        </Form>
                    )    
                }
            </Formik>
        </div>
    )
}