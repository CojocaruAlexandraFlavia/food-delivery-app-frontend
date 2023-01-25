import { Fragment, useEffect, useCallback, useState } from "react"
import { Container, Row, Col, ListGroup } from "react-bootstrap"
import Order from "./Order"
import ClientReviewList from "./ClientReviewList"
import ClientAccountInfo from "./ClientAccountInfo"
import ClientSavedAddresses from "./ClientSavedAddresses"
import EditClientAccountInfo from "./EditClientAccountInfo"
import ClientFavoriteProducts from "./ClientFavoriteProducts"
import ClientOrderList from "./ClientOrderList"


const ClientAccountInfoMenu = () => {
    
    const listItems = ["account info", "orders", "saved addresses", "reviews", "favorite products"]
    const [listItemActive, setListItemActive] = useState("")
    const [options, setOptions] = useState({
        seeAccountInfo: false,
        seeOrder: false,
        seeAddresses: false,
        seeOrderList: false,
        seeReviewList: false,
        seeFavoriteProducts: false,
        editInfo: false
    })
    const [orderId, setOrderId] = useState(0)

    const updateFieldValue = useCallback((key) => {
        setOptions({...options, [key]: true})
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
    }, [updateFieldValue])

    const buildListItem = listItem => {
        return listItem.replaceAll(" ", "-")
    }

    return(
        <Fragment>
            <Container>
                <Row>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            {
                                listItems.map((listItem, i) => <ListGroup.Item active={listItems[i] === listItemActive} 
                                                                            action href={"/client-account/"+ buildListItem(listItem)}>
                                    {listItem.charAt(0).toUpperCase() + listItem.slice(1)}
                                </ListGroup.Item>)
                            }
                        </ListGroup>
                    </Col>
                    <Col md={9}>
                        {
                            options.seeAccountInfo? <ClientAccountInfo/> :
                            options.seeAddresses? <ClientSavedAddresses/>:
                            options.editInfo? <EditClientAccountInfo/>:
                            options.seeFavoriteProducts? <ClientFavoriteProducts/>:
                            options.seeOrder? <Order orderId={orderId}/>:
                            options.seeOrderList? <ClientOrderList/>:
                            options.seeReviewList? <ClientReviewList/>:null
                        }
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )

}

export default ClientAccountInfoMenu