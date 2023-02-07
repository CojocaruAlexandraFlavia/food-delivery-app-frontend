import { useContext, Fragment } from "react"
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import UserContext from "../context/UserContext"

const ManagerNavbar = () => {

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
                    <Navbar.Brand href="/home-restaurant-manager">Happy Meal</Navbar.Brand>
                    <Navbar.Toggle/>
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link href="/manager-account/owned-restaurants">Owned restaurants</Nav.Link>
                            <Nav.Link href="/manager-account/reviews">Reviews</Nav.Link>
                        </Nav>
                        <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            <NavDropdown title={user.firstName + " " + user.lastName}>
                                <NavDropdown.Item href={"/manager-account/account-info"}>Account info</NavDropdown.Item>
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

export default ManagerNavbar

