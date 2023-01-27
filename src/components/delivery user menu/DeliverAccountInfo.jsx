import { Container } from "react-bootstrap"


const DeliverAccountInfo = ({deliver}) => {

    return(
        <Container>
             {
                deliver !== undefined ? <h3> First name: {deliver.firstName} <br/>
                    Last name: {deliver.lastName} <br/>
                    Email: {deliver.email} <br/>
                    Phone number: {deliver.phoneNumber}
                </h3>: null
            }
        </Container>
    )
}

export default DeliverAccountInfo