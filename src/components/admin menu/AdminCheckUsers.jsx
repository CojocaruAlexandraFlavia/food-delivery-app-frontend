import { Fragment, useEffect } from "react"
import { useState } from "react"
import { Container } from "react-bootstrap"


const AdminCheckUsers = () => {

    const [clients, setClients] = useState([])

    useEffect(() => {
        fetch("/user/get-all-clients")
            .then(response => response.json())
            .then(response => setClients(response))
    }, [])

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Container style={boxStyle}>
            <h2 style={{textAlign:"center"}}>Check registered users</h2> <br/>
            {
                clients !== undefined? clients.map((client, i) => <Fragment key={i}>
                    <div style={boxStyle}>
                        <h5>First name: {client.firstName}</h5>
                        <h5>Last name: {client.lastName}</h5>
                        <h5>Email: {client.email}</h5>
                        <h5>Phone number: {client.phoneNumber}</h5>
                    </div> <br/>
                </Fragment>): null
            }
        </Container>
    )


}

export default AdminCheckUsers