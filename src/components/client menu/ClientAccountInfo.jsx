import { Container } from "react-bootstrap"


const ClientAccountInfo = ({user}) => {

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Container style={boxStyle}>
            <h3  style={{textAlign: "center"}}>Account info</h3> <br/>
            <div style={boxStyle}>
                <h4>First name: {user.firstName} <br/>
                    Last name: {user.lastName} <br/>
                    Email: {user.email} <br/>
                    Phone number: {user.phoneNumber}
                </h4>
                <a href="/client-account/account-info/edit">Edit details</a>
            </div> 
        </Container>
    )


}

export default ClientAccountInfo