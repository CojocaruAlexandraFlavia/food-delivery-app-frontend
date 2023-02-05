import { useContext } from "react"
import { useEffect, useState, useCallback } from "react"
import { Col, Container, Row, ListGroup } from "react-bootstrap"
import AddRestaurant from "./AddRestaurant"
import UserContext from "../context/UserContext"
import AddDeliveryUser from "./AddDeliveryUser"
import AdminAccountInfo from "./AdminAccountInfo"
import AdminCheckOrders from "./AdminCheckOrders"
import AdminCheckUsers from "./AdminCheckUsers"
import ManageRestaurants from "./ManageRestaurants"
import ManageDeliveryUsers from "./ManageDeliveryUsers"
import EditAdminInfo from "./EditAdminInfo"
import { Fragment } from "react"
import AdminNavbar from "./AdminNavbar"


const AdminAccountMenu = () => {

    const {user, setUser} = useContext(UserContext)

    const listItems = ["account info", "add restaurant", "restaurants", "add delivery user", "delivery users", 
                        "check registered users", "check orders total count"]

    const [listItemActive, setListItemActive] = useState("")
    const [options] = useState({
        accountInfo: false,
        editInfo:false,
        addRestaurant: false,
        restaurants: false,
        addDeliveryUser: false,
        deliveryUsers: false,
        checkRegisteredUsers: false,
        checkOrdersTotalCount: false
    })

    const updateFieldValue = useCallback((key) => {
        options[key] = true
    }, [options])

    useEffect(() => {
        let activeListItem = window.location.pathname.substring(1).split("/")[1]
        activeListItem = activeListItem.replaceAll("-", " ")
        setListItemActive(activeListItem)

        const secondParam = window.location.pathname.substring(1).split("/")[2]

        if(secondParam === "edit") updateFieldValue("editInfo")
        else {
            const activeListItemWords = activeListItem.split(" ")
            for(let i = 1; i < activeListItemWords.length; i++) {
                activeListItemWords[i] = activeListItemWords[i][0].toUpperCase() + activeListItemWords[i].substring(1)
            }
            const currentOption = activeListItemWords.join("")
            updateFieldValue(currentOption)
        }
    }, [updateFieldValue])

    const buildListItem = listItem => {
        return listItem.replaceAll(" ", "-")
    }

    return(
        <Fragment>
            <AdminNavbar/> <br/>
            <Container>
                <Row>
                    <Col md={3}>
                        <ListGroup variant="flush" style={{ boxShadow:"1px 1px 4px 4px lightgrey"}}>
                                {
                                    listItems.map((listItem, i) => <ListGroup.Item key={i} active={listItems[i] === listItemActive} 
                                                                                action href={"/admin-account/"+ buildListItem(listItem)}>
                                        {listItem.charAt(0).toUpperCase() + listItem.slice(1)}
                                    </ListGroup.Item>)
                                }
                        </ListGroup>
                    </Col>
                    <Col md={9}>
                        {
                            options.accountInfo? <AdminAccountInfo admin={user}/>:
                            options.addDeliveryUser? <AddDeliveryUser/>:
                            options.addRestaurant? <AddRestaurant/>:
                            options.restaurants? <ManageRestaurants/>:
                            options.checkOrdersTotalCount? <AdminCheckOrders/>:
                            options.checkRegisteredUsers? <AdminCheckUsers/>:
                            options.editInfo? <EditAdminInfo admin={user} setUser={setUser}/>:
                            options.deliveryUsers? <ManageDeliveryUsers/>: null
                        }
                    </Col>
                </Row>
            </Container>
        </Fragment>
        
    )
}

export default AdminAccountMenu