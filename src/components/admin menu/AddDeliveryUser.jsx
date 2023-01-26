import { useState } from "react"
import { Button, Container, Form } from "react-bootstrap"


const AddDeliveryUser = () => {

    const [deliveryUser, setDeliveryUser] = useState({
        firstName:"",
        lastName:"",
        email:""
    })
    const [errors, setErrors] = useState({})
    const [added, setAdded] = useState(false)
    
    const findFormErrors = () => {
        const {firstName, lastName, email} = deliveryUser
        const requiredField = "Required field"
        const newErrors = {}

        if(firstName === "") newErrors.firstName = requiredField
        if(lastName === "") newErrors.lastName = requiredField
        if(email === "") newErrors.email = requiredField
        else{
            const emailRegex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/
            if(!emailRegex.test(email)) newErrors.email = "Invalid format"
        }

        return newErrors
    }

    const onChange = (e) => {
        const {id, value} = e.target
        setDeliveryUser({ ...deliveryUser, [id]: value });
        if(errors[id]) {
            setErrors({...errors, [id]: null})
        }
    }

    const saveDeliveryUser = () => {
        const newErrors = findFormErrors()
        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            fetch(`/restaurant/add-deliver`, {
                method: "POST",
                body: JSON.stringify(deliveryUser),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if(response.status === 200) {
                    setAdded(true)
                    setErrors({})
                    setTimeout(() => {
                        setAdded(false)
                    }, 3000)
                }
            })
        }
    }

    return(
        <Container>
            <Form>
                <Form.Group>
                    <Form.Label>First name</Form.Label>
                    <Form.Control isInvalid={errors.firstName} id={"firstName"} value={deliveryUser.firstName} onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.firstName}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control isInvalid={errors.lastName} id={"lastName"} value={deliveryUser.lastName} onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.lastName}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control isInvalid={errors.email} id={"email"} value={deliveryUser.email} type="email" onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.email}</Form.Control.Feedback>
                </Form.Group>
                <Button variant="success" onClick={saveDeliveryUser}>Save delivery user</Button>
                <br/>
                {
                    added? <h3>Delivery user added successfully</h3>: null
                }
            </Form>
        </Container>
    )

}

export default AddDeliveryUser