import { useState, useEffect } from "react"
import { Container, Form, Button } from "react-bootstrap"

const EditAdminInfo = ({admin, setUser}) => {
    const [updatedAdmin, setUpdatedAdmin] = useState(admin)
    const [errors, setErrors] = useState({})
    const [updated, setUpdated] = useState(false)

    useEffect(() => {
        setUpdatedAdmin(admin)
    }, [admin])

    const findFormErrors = () => {
        const {firstName, lastName, email, phoneNumber} = updatedAdmin
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
        setUpdatedAdmin({ ...updatedAdmin, [id]: value });
        if(errors[id]) {
            setErrors({...errors, [id]: null})
        }
    }

    const updateAdmin = () => {
        const newErrors = findFormErrors()
        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            fetch(`/user/update-admin/${admin.id}`, {
                method: "PUT",
                body: JSON.stringify(updatedAdmin),
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

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Container style={boxStyle}>
            <h2 style={{textAlign:"center"}}>Edit account details</h2> <br/>
            <Form>
                <Form.Group>
                    <Form.Label>First name</Form.Label>
                    <Form.Control isInvalid={errors.firstName} id={"firstName"} value={updatedAdmin.firstName || ""} onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.firstName}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control isInvalid={errors.lastName} id={"lastName"} value={updatedAdmin.lastName || ""} onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.lastName}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control isInvalid={errors.email} id={"email"} value={updatedAdmin.email || ""} type="email" onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control isInvalid={errors.phoneNumber} id={"phoneNumber"} value={updatedAdmin.phoneNumber || ""} type="email" onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.email}</Form.Control.Feedback>
                </Form.Group> <br/>
                <Button variant="success" onClick={updateAdmin}>Save admin</Button>
                {
                    updated? <h3 style={{color:"green"}}>Details updated successfully!</h3>: null
                }
            </Form>
        </Container>
    )
}

export default EditAdminInfo