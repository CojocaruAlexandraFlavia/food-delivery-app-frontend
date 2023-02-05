import { Container } from "react-bootstrap"

const ManagerAccountInfo = ({manager}) => {


    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Container style={boxStyle}>
            <h3  style={{textAlign: "center"}}>Account info</h3> <br/>
            <div style={boxStyle}>
                <h5>First name: {manager.firstName} <br/>
                    Last name: {manager.lastName} <br/>
                    Email: {manager.email} <br/>
                    Phone number: {manager.phoneNumber}
                </h5>
                <a href="/manager-account/account-info/edit">Edit details</a>
            </div> 
        </Container>
    )
}

export default ManagerAccountInfo