import React from "react";
import { Container } from "react-bootstrap";
import AdminNavbar from "./admin menu/AdminNavbar";

const AdminHomePage = () => {

    return(
        <Container>
            <h1>Admin home page</h1>
            <AdminNavbar/>
        </Container>
    )

}

export default AdminHomePage