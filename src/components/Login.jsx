import React, { useState, useContext, Fragment } from "react";
import  { useNavigate } from 'react-router-dom'
import { Button, Container, Form } from "react-bootstrap";
import UserContext from "./context/UserContext"
import functions from "./util/UtilFunctions";

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const {user, setUser} = useContext(UserContext)

    const navigate = useNavigate()

    const submitLogin = () => {
        functions.loginPromise(email, password).then(response => response.json())
            .then(response => {
                console.log(response)
                setUser(response.user)
                sessionStorage.setItem("token", response.token)
                const role = response.user.role;
                if (role === "ROLE_CLIENT_USER")
                    navigate("/home-client")
                else if (role === "ROLE_ADMIN")
                    navigate("/home-admin")
                else if (role === "ROLE_DELIVERY_USER")
                    navigate("/home-delivery-user")
                else navigate("/home-restaurant-manager")
            }).catch(() => {
                setError("Wrong credentials")
        })
    }

    return (
        <Container>
            <Form>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                {
                    error? <Fragment>
                        <Form.Text style={{color: "red", fontWeight: "bold", textTransform:"uppercase"}}>{error}</Form.Text>
                        <br/>
                    </Fragment>: null
                }
                <Button onClick={submitLogin} variant={"success"}>Login</Button>
            </Form>
        </Container>
    )
}

export default Login