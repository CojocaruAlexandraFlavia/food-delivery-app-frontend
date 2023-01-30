import { Fragment, useContext, useEffect, useState } from "react"
import { Container, Row, Col, ListGroup } from "react-bootstrap"
import UserContext from "../context/UserContext"


const ClientAccountCart = () => {
    const {user} = useContext(UserContext)
    return(
        <Container>
            <h3>{user}<br/>
            
            </h3>
        </Container>
    )


}

export default ClientAccountCart