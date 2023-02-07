import { useContext, useState, useEffect, Fragment } from "react"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import UserContext from "../context/UserContext"
import {FaShoppingCart} from "react-icons/fa"


const ClientNavbar = () => {

    const {user, setUser} = useContext(UserContext)
    const [unseenNotifications, setUnseenNotifications] = useState(0)

    useEffect(() => {
        if(user !== undefined && user.notifications !== undefined) {
            const filtered = user.notifications.filter(n => n.seen.toString() === "false")
            setUnseenNotifications(filtered.length)
        }
    }, [user])

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
                    <Navbar.Brand href="/home-client">Happy Meal</Navbar.Brand>
                    <Navbar.Toggle/>
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link href="/client-account/orders">Orders</Nav.Link>
                            <Nav.Link href="/client-account/reviews">Reviews</Nav.Link>
                            <Nav.Link href="/client-account/favorite-products">Favorite products</Nav.Link>
                            <Nav.Link href="/client-account/saved-addresses">Saved addresses</Nav.Link>
                            <Nav.Link href="/client-account/notifications">Notifications ({unseenNotifications})</Nav.Link>
                        </Nav>
                        <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            <Nav.Link href="/client-account/view-cart">
                                <FaShoppingCart size={25}/>
                            </Nav.Link>
                            <NavDropdown title={user.firstName + " " + user.lastName}>
                                <NavDropdown.Item href={"/client-account/account-info"}>Account info</NavDropdown.Item>
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

export default ClientNavbar