import React, { useState} from "react";
import { Form, Row, Col, Button, Container, Modal } from "react-bootstrap";
import PasswordStrengthBar from "react-password-strength-bar";
import { useNavigate } from "react-router";
import "./style/login.css"

const Register = () => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState({})
    const [added, setAdded] = useState(false)
    const navigate = useNavigate()

    const onChange = (e) => {
        const {id, value} = e.target
        setUser({ ...user, [id]: value });
        if(errors[id]) {
            setErrors({...errors, [id]: null})
        }
    }

    const findFormErrors = () => {
        const {firstName, lastName, confirmPassword, email, password} = user
        const newErrors = {}
        const requiredField = "Required field"

        if(firstName === "") newErrors.firstName = requiredField
        if(lastName === "") newErrors.lastName = requiredField
        if(email.length === 0) newErrors.email = requiredField
        else{
            const emailRegex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/
            if(!emailRegex.test(email)) newErrors.email = "Invalid format"
        }
        if(password === "") newErrors.password = requiredField
        else if(password.length < 8) {
            newErrors.password = "Password too short!"
        }
        if(confirmPassword === "") newErrors.confirmPassword = requiredField
        else if(password !== "" && confirmPassword !== "" && password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match!"

        return newErrors
    }

    const saveUser = () => {

        const newErrors = findFormErrors()
        if( Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {

            const controller = new AbortController()
            const signal = controller.signal

            fetch("/register", {
                method: "POST",
                signal:signal,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            }).then(response => {
                if(response.status === 409) {
                    setErrors({...errors, email: "There is an account with this email address!"})
                } else if(response.status === 200) {
                    setErrors({})
                    setAdded(true)
                    setTimeout(() => {
                        navigate("/")
                        setAdded(false)
                        setUser({
                            firstName: "",
                            lastName: "",
                            email: "",
                            password: "",
                            confirmPassword: ""
                        })
                    }, 5000)
                }
            })
        }
    }

    return(
        <Container className="loginContainer">
            <div className="loginDiv">
                <h3 style={{textAlign:"center"}}>Register</h3> <br/>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Last name</Form.Label>
                                <Form.Control isInvalid={errors.lastName} id={"lastName"} value={user.lastName} onChange={onChange}/>
                                <Form.Control.Feedback type={"invalid"}>{errors.lastName}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>First name</Form.Label>
                                <Form.Control isInvalid={errors.firstName} id={"firstName"} value={user.firstName} onChange={onChange}/>
                                <Form.Control.Feedback type={"invalid"}>{errors.firstName}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row> <br/>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                            <Form.Control isInvalid={errors.email} id={"email"} value={user.email} type="email" onChange={onChange}/>
                            <Form.Control.Feedback type={"invalid"}>{errors.email}</Form.Control.Feedback>
                    </Form.Group> <br/>
                    <Row className="mb-6">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control id={"password"} value={user.password} type="password" onChange={onChange} isInvalid={errors.password}/>
                                <Form.Control.Feedback type={"invalid"}>{errors.password}</Form.Control.Feedback>
                                <PasswordStrengthBar password={user.password} minLength={8} scoreWords={["Weak", "OK", "Good", "Strong", "Very strong"]}
                                                    shortScoreWord={"Password should contain min. 8 characters"}/>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Confirm password</Form.Label>
                                <Form.Control id={"confirmPassword"} value={user.confirmPassword} type="password" onChange={onChange} isInvalid={errors.confirmPassword}/>
                                <Form.Control.Feedback type={"invalid"}>{errors.confirmPassword}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row> <br/>
                    <div style={{display:"flex", justifyContent:"center"}}>
                        <Button style={{width:"50%", alignSelf:"center"}} onClick={saveUser} variant={"success"}>Submit</Button>
                    </div> 
                </Form>
            </div>
            <Modal show={added} centered>
                <Modal.Body>
                    User registered successfully! You will be redirected to login in 5 seconds...
                </Modal.Body>
            </Modal>      
        </Container>
    )
}

export default Register