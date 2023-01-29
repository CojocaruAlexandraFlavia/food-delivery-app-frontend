import { Container } from "react-bootstrap"


const AdminAccountInfo = ({admin}) => {
    

    return(
        <Container>
            {
                admin !== undefined ? <h3>First name: {admin.firstName} <br/>
                    Last name: {admin.lastName} <br/>
                    Email: {admin.email} <br/>
                    Phone number: {admin.phoneNumber}
                </h3>: null
            }
            <a href={"/admin-account/account-info/edit"}>Edit info</a>
    </Container>
    )
}

export default AdminAccountInfo