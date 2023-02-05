import { Container } from "react-bootstrap"


const AdminAccountInfo = ({admin}) => {
    
    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Container style={boxStyle}>
            <h3  style={{textAlign: "center"}}>Account info</h3> <br/>
            <div style={boxStyle}>
                <h5>First name: {admin.firstName} <br/>
                    Last name: {admin.lastName} <br/>
                    Email: {admin.email} <br/>
                    Phone number: {admin.phoneNumber}
                </h5>
                <a href="/admin-account/account-info/edit">Edit details</a>
            </div> 
    </Container>
    )
}

export default AdminAccountInfo