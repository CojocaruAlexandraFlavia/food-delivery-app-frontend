import { Container } from "react-bootstrap"

const ManagerAccountInfo = ({manager}) => {


    return(
        <Container>
            {
                manager !== undefined ? <h3>First name: {manager.firstName} <br/>
                    Last name: {manager.lastName} <br/>
                    Email: {manager.email} <br/>
                    Phone number: {manager.phoneNumber}
                </h3>: null
            }
            
    </Container>
    )
}

export default ManagerAccountInfo