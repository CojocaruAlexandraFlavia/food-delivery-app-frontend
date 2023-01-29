import { Container } from "react-bootstrap"


const ClientAccountInfo = ({user}) => {

    return(
        <Container>
            <h3>First name: {user.firstName} <br/>
            Last name: {user.lastName} <br/>
            Email: {user.email} <br/>
            Phone number: {user.phoneNumber}
            </h3>
            <a href="/client-account/account-info/edit">Edit details</a>
        </Container>
    )


}

export default ClientAccountInfo