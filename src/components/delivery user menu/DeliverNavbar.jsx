import { useContext, Fragment } from "react"
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import UserContext from "../context/UserContext"


const DeliverNavbar = () => {
    
    const {user, setUser} = useContext(UserContext)

    const handleLogout = () => {
        fetch("/signOut", {
            method: "post"
        }).then(() => {
            localStorage.removeItem("token")
            window.location.href = "/"
            setUser({})
        })
    }

    return(
        <Fragment>
            <Navbar sticky bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/home-delivery-user">Happy Meal</Navbar.Brand>
                    <Navbar.Toggle/>
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link href="/deliver-account/new-orders">New orders</Nav.Link>
                            <Nav.Link href="/deliver-account/current-order">Current order</Nav.Link>
                            <Nav.Link href="/deliver-account/delivered-orders">Delivered orders</Nav.Link>
                        </Nav>
                        <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            <NavDropdown title={user.firstName + " " + user.lastName}>
                                <NavDropdown.Item href={"/deliver-account/account-info"}>Account info</NavDropdown.Item>
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

export default DeliverNavbar