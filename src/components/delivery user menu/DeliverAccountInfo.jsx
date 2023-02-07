import { Container } from "react-bootstrap"


const DeliverAccountInfo = ({deliver}) => {

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Container style={boxStyle}>
            <h3  style={{textAlign: "center"}}>Account info</h3> <br/>
            <div style={boxStyle}>
                <h5>First name: {deliver.firstName} <br/>
                    Last name: {deliver.lastName} <br/>
                    Email: {deliver.email} <br/>
                    Phone number: {deliver.phoneNumber}
                </h5>
                {/* <a href="/deliver-account/account-info/edit">Edit details</a> */}
            </div> 
        </Container>
    )
}

export default DeliverAccountInfo