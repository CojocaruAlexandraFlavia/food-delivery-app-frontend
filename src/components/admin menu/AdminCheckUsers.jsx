import { Fragment, useEffect } from "react"
import { useState } from "react"


const AdminCheckUsers = () => {

    const [clients, setClients] = useState([])

    useEffect(() => {
        fetch("/user/get-all-clients")
            .then(response => response.json())
            .then(response => setClients(response))
    }, [])

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"5px"}

    return(
        <Fragment>
            {
                clients !== undefined? clients.map((client, i) => <Fragment key={i}>
                    <div style={boxStyle}>
                        <h3>First name: {client.firstName}</h3>
                        <h3>Last name: {client.lastName}</h3>
                        <h3>Email: {client.email}</h3>
                        <h3>Phone number: {client.phoneNumber}</h3>
                    </div> <br/>
                </Fragment>): null
            }
        </Fragment>
    )


}

export default AdminCheckUsers