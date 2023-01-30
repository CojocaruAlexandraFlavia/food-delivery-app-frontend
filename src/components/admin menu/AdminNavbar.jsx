import { useContext } from "react"
import { Fragment } from "react"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import UserContext from "../context/UserContext"


const AdminNavbar = () => {

    const {user, setUser} = useContext(UserContext)

    const handleLogout = () => {
        fetch("/signOut", {
            method: "post"
        }).then(() => {
            localStorage.removeItem("token")
            setUser({})
            window.location.href = "/"
        })
    }

    return(
        <Fragment>
            <Navbar sticky bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/home-admin">Happy Meal</Navbar.Brand>
                    <Navbar.Toggle/>
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link href="/admin-account/add-restaurant">Add restaurant</Nav.Link>
                            <Nav.Link href="/admin-account/add-delivery-user">Add delivery user</Nav.Link>
                            <Nav.Link href="/admin-account/check-orders-total-count">Check orders total</Nav.Link>
                        </Nav>
                        <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            <NavDropdown title={user.firstName + " " + user.lastName}>
                                <NavDropdown.Item href={"/admin-account/account-info"}>Account info</NavDropdown.Item>
                                <NavDropdown.Divider/>
                                <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Fragment>
    )

}

export default AdminNavbar