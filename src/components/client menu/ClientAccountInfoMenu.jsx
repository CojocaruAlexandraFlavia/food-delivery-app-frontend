import { Fragment, useContext, useEffect, useState } from "react"
import { Container, Row, Col, ListGroup } from "react-bootstrap"
import Order from "../Order"
import ClientReviewList from "./ClientReviewList"
import ClientAccountInfo from "./ClientAccountInfo"
import ClientSavedAddresses from "./ClientSavedAddresses"
import EditClientAccountInfo from "./EditClientAccountInfo"
import ClientFavoriteProducts from "./ClientFavoriteProducts"
import ClientOrderList from "./ClientOrderList"
import { useCallback } from "react"
import UserContext from "../context/UserContext"
import ClientNotifications from "./ClientNotifications"
import ClientNavbar from "./ClientNavbar"


const ClientAccountInfoMenu = () => {

    const {user, setUser} = useContext(UserContext)
    
    const listItems = ["account info", "orders", "saved addresses", "reviews", "favorite products", "notifications"]
    const [listItemActive, setListItemActive] = useState("")
    const [options] = useState({
        seeAccountInfo: false,
        seeOrder: false,
        seeAddresses: false,
        seeOrderList: false,
        seeReviewList: false,
        seeFavoriteProducts: false,
        editInfo: false,
        seeNotifications: false
    })
    const [orderId, setOrderId] = useState(0)

    const updateFieldValue = useCallback((key) => {
        options[key] = true
    }, [options])

    useEffect(() => {

        let activeListItem = window.location.pathname.substring(1).split("/")[1]
        activeListItem = activeListItem.replaceAll("-", " ")
        setListItemActive(activeListItem)

        const secondParam = window.location.pathname.substring(1).split("/")[2]

        if(secondParam === "edit") updateFieldValue("editInfo")
        else if(activeListItem === "orders" && /^\d+$/.test(secondParam)) {
            updateFieldValue("seeOrder")
            setOrderId(secondParam)
        } else if (activeListItem === "saved addresses") updateFieldValue("seeAddresses")
        else if(activeListItem === "account info" && (secondParam === "" || secondParam === undefined)) updateFieldValue("seeAccountInfo")
        else if(activeListItem === "orders" && (secondParam === "" || secondParam === undefined)) updateFieldValue("seeOrderList")
        else if(activeListItem === "reviews") updateFieldValue("seeReviewList")
        else if(activeListItem === "favorite products") updateFieldValue("seeFavoriteProducts")
        else updateFieldValue("seeNotifications")
    }, [updateFieldValue])

    const buildListItem = listItem => {
        return listItem.replaceAll(" ", "-")
    }

    return(
        <Fragment>
            <ClientNavbar/> <br/>
            <Container>
                <Row>
                    <Col md={3}>
                        <ListGroup variant="flush" style={{borderRadius:"10px", boxShadow:"1px 1px 4px 4px lightgrey"}}>
                            {
                                listItems.map((listItem, i) => <ListGroup.Item key={i} active={listItems[i] === listItemActive} 
                                                                            action href={"/client-account/"+ buildListItem(listItem)}>
                                    {listItem.charAt(0).toUpperCase() + listItem.slice(1)}
                                </ListGroup.Item>)
                            }
                        </ListGroup>
                    </Col>
                    <Col md={9}>
                        {
                            options.seeAccountInfo? <ClientAccountInfo user={user}/> :
                            options.seeAddresses? <ClientSavedAddresses addresses={user.addresses} setUser={setUser} user={user}/>:
                            options.editInfo? <EditClientAccountInfo user={user} setUser={setUser}/>:
                            options.seeFavoriteProducts? <ClientFavoriteProducts products={user.favoriteProducts}/>:
                            options.seeOrder? <Order orderId={orderId}/>:
                            options.seeOrderList? <ClientOrderList orders={user.orders}/>:
                            options.seeNotifications? <ClientNotifications notifications={user.notifications}/>:
                            options.seeReviewList? <ClientReviewList reviews={user.reviews}/>:null
                        }
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )

}

export default ClientAccountInfoMenu