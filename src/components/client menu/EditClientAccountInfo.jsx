import { useEffect } from "react"
import { useState } from "react"
import { Container, Form, Button } from "react-bootstrap"

const EditClientAccountInfo = ({user, setUser}) => {

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}
    const [updatedClient, setUpdatedClient] = useState(user)
    const [errors, setErrors] = useState({})
    const [updated, setUpdated] = useState(false)

    useEffect(() => {
        setUpdatedClient(user)
    }, [user])

    const findFormErrors = () => {
        const {firstName, lastName, email, phoneNumber} = updatedClient
        const requiredField = "Required field"
        const newErrors = {}

        if(firstName === "") newErrors.firstName = requiredField
        if(lastName === "") newErrors.lastName = requiredField
        if(phoneNumber === "") newErrors.phoneNumber = requiredField
        if(email === "") newErrors.email = requiredField
        else{
            const emailRegex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/
            if(!emailRegex.test(email)) newErrors.email = "Invalid format"
        }

        return newErrors
    }


    const onChange = (e) => {
        const {id, value} = e.target
        setUpdatedClient({ ...updatedClient, [id]: value });
        if(errors[id]) {
            setErrors({...errors, [id]: null})
        }
    }

    const updateClient = () => {
        const newErrors = findFormErrors()
        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            fetch(`/user/update-client/${user.id}`, {
                method: "PUT",
                body: JSON.stringify(updatedClient),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            }).then(response => response.json()).then(response => {
                    setUpdated(true)
                    setErrors({})
                    setUser(response)
                    setTimeout(() => {
                        setUpdated(false)
                    }, 3000)
                })
        }
    }

    return(
        <Container>
            <div style={boxStyle}>
                <Form>
                    <Form.Group>
                        <Form.Label>First name</Form.Label>
                        <Form.Control isInvalid={errors.firstName} id={"firstName"} value={updatedClient.firstName || ""} onChange={onChange}/>
                        <Form.Control.Feedback type={"invalid"}>{errors.firstName}</Form.Control.Feedback>
                    </Form.Group> <br/>
                    <Form.Group>
                        <Form.Label>Last name</Form.Label>
                        <Form.Control isInvalid={errors.lastName} id={"lastName"} value={updatedClient.lastName || ""} onChange={onChange}/>
                        <Form.Control.Feedback type={"invalid"}>{errors.lastName}</Form.Control.Feedback>
                    </Form.Group> <br/>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control isInvalid={errors.email} id={"email"} value={updatedClient.email || ""} type="email" onChange={onChange}/>
                        <Form.Control.Feedback type={"invalid"}>{errors.email}</Form.Control.Feedback>
                    </Form.Group> <br/>
                    <Form.Group>
                        <Form.Label>Phone number</Form.Label>
                        <Form.Control isInvalid={errors.phoneNumber} id={"phoneNumber"} value={updatedClient.phoneNumber || ""} type="email" onChange={onChange}/>
                        <Form.Control.Feedback type={"invalid"}>{errors.email}</Form.Control.Feedback>
                    </Form.Group> <br/>
                    <Button variant="success" onClick={updateClient}>Save client</Button>
                    {
                        updated? <h3 style={{color:"green"}}>Details updated successfully!</h3>: null
                    }
                </Form>
            </div>
            
        </Container>
    )
}


export default EditClientAccountInfo