import { useContext, useCallback, useEffect, useState, Fragment } from "react"
import { Container, Row, Col, ListGroup } from "react-bootstrap"
import UserContext from "../context/UserContext"
import ManagerAccountInfo from "./ManagerAccountInfo"
import ManagerOwnedRestaurants from "./ManagerOwnedRestaurants"


const ManagerMenu = () => {

    const listItems = ["account info", "owned restaurants", "reviews"]

    const {user} = useContext(UserContext)

    const [options] = useState({
        accountInfo: false,
        ownedRestaurants: false,
        seeRestaurant: false, 
        reviews:false
    })
    const [listItemActive, setListItemActive] = useState("")
    const [restaurantId, setRestaurantId] = useState(0)

    const updateFieldValue = useCallback((key) => {
        options[key] = true
    }, [options])

    useEffect(() => {

        let activeListItem = window.location.pathname.substring(1).split("/")[1]
        activeListItem = activeListItem.replaceAll("-", " ")
        setListItemActive(activeListItem)

        const secondParam = window.location.pathname.substring(1).split("/")[2]
        if(activeListItem === "owned restaurants" && /^\d+$/.test(secondParam)) {
            updateFieldValue("seeRestaurant")
            setRestaurantId(secondParam)
        } else {
            const activeListItemWords = activeListItem.split("")
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
            <Container>
                <Row>
                    <Col md={3}>
                        <ListGroup variant="flush">
                                {
                                    listItems.map((listItem, i) => <ListGroup.Item key={i} active={listItems[i] === listItemActive} 
                                                                                action href={"/manager-account/"+ buildListItem(listItem)}>
                                        {listItem.charAt(0).toUpperCase() + listItem.slice(1)}
                                    </ListGroup.Item>)
                                }
                        </ListGroup>
                    </Col>
                    <Col md={9}>
                        {
                            options.accountInfo? <ManagerAccountInfo manager={user}/>:
                            options.ownedRestaurants? <ManagerOwnedRestaurants restaurants={user.ownedRestaurants}/>:null
                            // options.seeRestaurant? <DeliverCurrentOrder deliver={user}/>:
                            // options.reviews? <NewReceivedOrders/>: null
                        }
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )

}

export default ManagerMenu