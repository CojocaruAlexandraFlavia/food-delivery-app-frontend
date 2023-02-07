import React, { Fragment, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";


const AddRestaurantManager = (props) => {

    const [restaurantManager, setRestaurantManager] = useState({
        email:"",
        firstName:"",
        lastName:""
    })
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)

    const findFormErrors = () => {
        const {firstName, lastName,  email} = restaurantManager
        const newErrors = {}
        const requiredField = "Required field"

        if(firstName === "") newErrors.firstName = requiredField
        if(lastName === "") newErrors.lastName = requiredField
        if(email.length === 0) newErrors.email = requiredField
        else{
            const emailRegex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/
            if(!emailRegex.test(email)) newErrors.email = "Invalid format"
        }
        return newErrors
    }

    const onChange = (e) => {
        const {id, value} = e.target
        setRestaurantManager({ ...restaurantManager, [id]: value });
        if(errors[id]) {
            setErrors({...errors, [id]: null})
        }
    }

    const saveRestaurantManager = () => {

        const newErrors = findFormErrors()
        if( Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            const controller = new AbortController()
            const signal = controller.signal

            fetch("/restaurant/add-manager", {
                method: "POST",
                signal:signal,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify(restaurantManager),
            }).then(response => {
                if(response.status === 409) setErrors({...errors, email: "There is an account associted with this email address!"})
                else if(response.status === 200) {
                    response.json()
                    setErrors({})
                    setSuccess(true)
                    props.setRestaurantManagerId(response.id)
                }
            })
        }
    }

    return(
        <Fragment>
            <Container>
                <Form>
                    <Form.Group>
                        <Form.Label>First name</Form.Label>
                        <Form.Control value={restaurantManager.firstName} isInvalid={errors.firstName} id={"firstName"} onChange={onChange}/>
                        <Form.Control.Feedback type={"invalid"}>{errors.firstName}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Last name</Form.Label>
                        <Form.Control value={restaurantManager.lastName} isInvalid={errors.lastName} id={"lastName"} onChange={onChange}/>
                        <Form.Control.Feedback type={"invalid"}>{errors.lastName}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>Email</Form.Label>
                        <Form.Control isInvalid={errors.email} id={"email"} value={restaurantManager.email} type="email" onChange={onChange}/>
                        <Form.Control.Feedback type={"invalid"}>{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant={success} onClick={saveRestaurantManager}>Add manager</Button>
                </Form>
                <h3 hidden={!success} style={{color:"green"}}>Restaurant manager added successfully</h3>
            </Container>
        </Fragment>
    )


}

export default AddRestaurantManager;