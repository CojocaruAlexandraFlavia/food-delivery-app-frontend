import { useState } from "react"
import { Container, Form, Button } from "react-bootstrap"


const EditDeliveryUser = ({user}) => {

    const [updatedUser, setUpdatedUser] = useState(user)
    const [errors, setErrors] = useState({})
    const [updated, setUpdated] = useState(false)

    const findFormErrors = () => {
        const {firstName, lastName, email, phoneNumber} = updatedUser
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
        setUpdatedUser({ ...updatedUser, [id]: value });
        if(errors[id]) {
            setErrors({...errors, [id]: null})
        }
    }

    const updateDeliveryUser = () => {
        const newErrors = findFormErrors()
        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            fetch(`/order/update-delivery-user/${user.id}`, {
                method: "PUT",
                body: JSON.stringify(updateDeliveryUser),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if(response.status === 200) {
                    setUpdated(true)
                    setErrors({})
                    setTimeout(() => {
                        setUpdated(false)
                    }, 3000)
                }
            })
        }
    }

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Container style={boxStyle}>
            <h2 style={{textAlign:"center"}}>Edit delivery user</h2> <br/>
            <Form>
                <Form.Group>
                    <Form.Label>First name</Form.Label>
                    <Form.Control isInvalid={errors.firstName} id={"firstName"} value={updatedUser.firstName} onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.firstName}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control isInvalid={errors.lastName} id={"lastName"} value={updatedUser.lastName} onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.lastName}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control isInvalid={errors.email} id={"email"} value={updatedUser.email} type="email" onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control isInvalid={errors.phoneNumber} id={"phoneNumber"} value={updatedUser.phoneNumber} type="email" onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.email}</Form.Control.Feedback>
                </Form.Group> <br/>
                <Button variant="success" onClick={updateDeliveryUser}>Save delivery user</Button>
                {
                    updated? <h3 style={{color:"green"}}>Details updated successfully!</h3>: null
                }
            </Form>
        </Container>
    )
}

export default EditDeliveryUser