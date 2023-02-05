import React, { useState, useContext, Fragment } from "react";
import  { useNavigate } from 'react-router-dom'
import { Button, Container, Form } from "react-bootstrap";
import UserContext from "./context/UserContext"
import functions from "./util/UtilFunctions";
import "./style/login.css"

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const {setUser} = useContext(UserContext)

    const navigate = useNavigate()

    const submitLogin = () => {
        functions.loginPromise(email, password).then(response => response.json())
            .then(response => {
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
                setError("Wrong credentials!")
        })
    }

    return (
        <Container className="loginContainer">
            <div className={"loginDiv"}>
                <h3 style={{textAlign:"center"}}>Login</h3> <br/>
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
                    } <br/>
                    <div style={{display:"flex", justifyContent:"center"}}>
                        <Button style={{width:"50%", alignSelf:"center"}} onClick={submitLogin} variant={"success"}>Login</Button>
                    </div>                   
                </Form> <br/>
                <p style={{textAlign:"center"}}>You don't have an account? <a href="/register">Register</a></p>
            </div>
            
        </Container>
    )
}

export default Login