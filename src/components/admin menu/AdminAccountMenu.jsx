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


const AdminAccountMenu = () => {

    const {user} = useContext(UserContext)

    const listItems = ["account info", "add restaurant", "restaurants", "add delivery user", "delivery users", 
                        "check registered users", "check orders total count"]

    const [listItemActive, setListItemActive] = useState("")
    const [options] = useState({
        accountInfo: false,
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

        switch(activeListItem){
            case "account info":
                updateFieldValue("accountInfo")
                break;
            case "add restaurant":
                updateFieldValue("addRestaurant")
                break
            case "restaurants":
                updateFieldValue("restaurants")
                break
            case "add delivery user":
                updateFieldValue("addDeliveryUser")
                break
            case "delivery users":
                updateFieldValue("deliveryUsers")
                break
            case "check registered users":
                updateFieldValue("checkRegisteredUsers")
                break
            case "check orders total count":
                updateFieldValue("checkOrdersTotalCount")
                break
            default:
                console.log("default")
        }
    }, [updateFieldValue])

    const buildListItem = listItem => {
        return listItem.replaceAll(" ", "-")
    }

    return(
        <Container>
            <Row>
                <Col md={6}>
                    <ListGroup variant="flush">
                            {
                                listItems.map((listItem, i) => <ListGroup.Item key={i} active={listItems[i] === listItemActive} 
                                                                            action href={"/admin-account/"+ buildListItem(listItem)}>
                                    {listItem.charAt(0).toUpperCase() + listItem.slice(1)}
                                </ListGroup.Item>)
                            }
                    </ListGroup>
                </Col>
                <Col md={6}>
                    {
                        options.accountInfo? <AdminAccountInfo admin={user}/>:
                        options.addDeliveryUser? <AddDeliveryUser/>:
                        options.addRestaurant? <AddRestaurant/>:
                        options.restaurants? <ManageRestaurants/>:
                        options.checkOrdersTotalCount? <AdminCheckOrders/>:
                        options.checkRegisteredUsers? <AdminCheckUsers/>:
                        options.deliveryUsers? <ManageDeliveryUsers/>: null
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default AdminAccountMenu