import React, { useState} from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import PasswordStrengthBar from "react-password-strength-bar";

const Register = () => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState({})

    const onChange = (e) => {
        const {id, value} = e.target
        setUser({ ...user, [id]: value });
        if(errors[id]) {
            setErrors({...errors, [id]: null})
        }
    }

    const findFormErrors = () => {
        const {firstName, lastName, confirmPassword, email, password} = user
        console.log(user)
        const newErrors = {}
        const requiredField = "Câmp obligatoriu"

        if(firstName === "") newErrors.firstName = requiredField
        if(lastName === "") newErrors.lastName = requiredField
        if(email.length === 0) newErrors.email = requiredField
        else{
            const emailRegex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/
            if(!emailRegex.test(email)) newErrors.email = "Format invalid"
        }
        if(password === "") newErrors.password = requiredField
        else if(password.length < 8) {
            console.log(password.length)
            newErrors.password = "Parolă prea scurtă!"
        }
        if(confirmPassword === "") newErrors.confirmPassword = requiredField
        else if(password !== "" && confirmPassword !== "" && password !== confirmPassword) newErrors.confirmPassword = "Parolele nu coincid"

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
                if(response.status === 409) setErrors({...errors, email: "Există un cont asociat cu această adresă de email!"})
                else if(response.status === 200) {
                    setErrors({})
                }
            })
        }
    }

    return(
        <Container>
            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Nume</Form.Label>
                            <Form.Control isInvalid={errors.lastName} id={"lastName"} value={user.lastName} onChange={onChange}/>
                            <Form.Control.Feedback type={"invalid"}>{errors.lastName}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Prenume</Form.Label>
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
                            <Form.Label>Parolă</Form.Label>
                            <Form.Control id={"password"} value={user.password} type="password" onChange={onChange} isInvalid={errors.password}/>
                            <Form.Control.Feedback type={"invalid"}>{errors.password}</Form.Control.Feedback>
                            <PasswordStrengthBar password={user.password} minLength={8}
                                                             scoreWords={["Parolă slabă", "Parolă ok", "Parolă bună", "Parolă puternică", "Parolă foarte puternică"]}
                                                             shortScoreWord={"Parola trebuie să conțină cel puțin 8 caractere"}/>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Confirmați parola</Form.Label>
                            <Form.Control id={"confirmPassword"} value={user.confirmPassword} type="password" onChange={onChange} isInvalid={errors.confirmPassword}/>
                            <Form.Control.Feedback type={"invalid"}>{errors.confirmPassword}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="outline-success" onClick={saveUser}>Submit</Button>
            </Form>
        </Container>
    )

}

export default Register