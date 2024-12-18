import {useState, useEffect} from 'react'
import styled from 'styled-components'
import Loading from "../utils/Loading.jsx";
import axios from "axios";

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
`

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    width: 400px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
`

const ModalHeader = styled.h2`
    margin-top: 0;
    text-align: center;
    margin-bottom: 20px;
`

const FormField = styled.div`
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        flex: 2;
    }

    input,
    select {
        width: auto;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-left: 10px;
        flex: 10;
    }
`

// const CheckBoxGroup = styled.div`
//   display: flex;
//   justify-content: space-around;
//   align-items: center;
//   flex: 10;
//
//   label {
//     font-weight: normal;
//   }
// `

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
`

const Button = styled.button`
    background-color: ${(props) => (props.primary ? '#03a9f4' : '#ccc')};
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;

    &:hover {
        opacity: 0.8;
    }
`

// const TextSexCustom = styled.text`
//   margin-left: 6px;
// `

let getUserAPI = import.meta.env.VITE_API_AUTH_URL

// eslint-disable-next-line react/prop-types
const CreateUserModal = ({isOpen, onClose, initialData = null, onUserCreated, method}) => {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        gender: '',
        email: '',
        phone: ''
    })
    console.log(method)
    console.log('initialData: ', initialData)

    const [isLoading, setIsLoading] = useState(false)

    // Update formData when initialData has a value
    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        } else {
            setFormData({
                full_name: '',
                role: '',
                gender: '',
                name: '',
                phone: ''
            })
        }
    }, [initialData])

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData((prevData) => ({...prevData, [name]: value}))
    }

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Empty')
    } else {
        token = fullData.access_token
        console.log(token)
    }

    const handleSubmit = async () => {
        if (!formData.name || !formData.role) {
            alert('Please fill in all required fields.')
            return
        }
        let api = getUserAPI
        let password = '123456'
        if (method === 'PUT') {
            api = api + initialData.id
            password = initialData.password
        }
        const requestBody = {
            full_name: formData.full_name,
            password: password,
            role_id: formData.role === "admin" ? 1 : formData.role === "user" ? 2 : null,
            email: formData.name,
            // phone: formData.phone
        };
        console.log('Api: ', api)
        console.log('password: ', password)
        console.log(requestBody)
        try {
            setIsLoading(true);
            const response = await axios({
                url: api,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: requestBody,
            });

            if (response.status >= 200 && response.status < 300) {
                console.log('User created successfully');
                onUserCreated();
                onClose();
            } else {
                console.error('Error creating user:', response.data);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error creating user:', error.response.data);
            } else {
                console.error('Error:', error.message);
            }
        } finally {
            setIsLoading(false);
        }

    }

    const handleCancel = () => {
        onClose() // Close the modal without refreshing user data
    }

    if (!isOpen) return null

    return (
        <>
            {isLoading && <Loading/>}
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader>Add New User</ModalHeader>

                    <FormField>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            placeholder="Enter your full name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                        />
                    </FormField>

                    <FormField>
                        <label>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Role</option>
                            <option value="admin">admin</option>
                            <option value="user">user</option>
                        </select>
                    </FormField>

                    {/*<FormField>*/}
                    {/*  <label>Gender</label>*/}
                    {/*  <CheckBoxGroup>*/}
                    {/*    <label>*/}
                    {/*      <input*/}
                    {/*        type="radio"*/}
                    {/*        name="gender"*/}
                    {/*        value="male"*/}
                    {/*        checked={formData.gender === 'male'}*/}
                    {/*        onChange={handleInputChange}*/}
                    {/*      />*/}
                    {/*      <TextSexCustom>Male</TextSexCustom>*/}
                    {/*    </label>*/}
                    {/*    <label>*/}
                    {/*      <input*/}
                    {/*        type="radio"*/}
                    {/*        name="gender"*/}
                    {/*        value="female"*/}
                    {/*        checked={formData.gender === 'female'}*/}
                    {/*        onChange={handleInputChange}*/}
                    {/*      />*/}
                    {/*      <TextSexCustom>Female</TextSexCustom>*/}
                    {/*    </label>*/}
                    {/*  </CheckBoxGroup>*/}
                    {/*</FormField>*/}

                    <FormField>
                        <label>Email</label>
                        <input
                            type="name"
                            name="name"
                            placeholder="Enter email"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </FormField>

                    {/*<FormField>*/}
                    {/*    <label>Phone</label>*/}
                    {/*    <input*/}
                    {/*        type="tel"*/}
                    {/*        name="phone"*/}
                    {/*        placeholder="Enter phone number"*/}
                    {/*        value={formData.phone}*/}
                    {/*        onChange={handleInputChange}*/}
                    {/*    />*/}
                    {/*</FormField>*/}

                    <ButtonGroup>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button primary onClick={handleSubmit}>
                            Submit
                        </Button>
                    </ButtonGroup>
                </ModalContent>
            </ModalOverlay>
        </>
    )
}

export default CreateUserModal
