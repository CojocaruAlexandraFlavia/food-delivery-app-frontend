import { useContext, useCallback, useEffect, useState, Fragment } from "react"
import { Container, Row, Col, ListGroup } from "react-bootstrap"
import UserContext from "../context/UserContext"
import ManagerAccountInfo from "./ManagerAccountInfo"
import ManagerNavbar from "./ManagerNavbar"
import OwnedRestaurantReviews from "./OwnedRestaurantReviews"
import ManagerOwnedRestaurants from "./ManagerOwnedRestaurants"
import RestaurantPage from "../RestaurantPage"


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
            <ManagerNavbar/> <br/>
            <Container>
                <Row>
                    <Col md={3}>
                        <ListGroup variant="flush" style={{boxShadow:"1px 1px 4px 4px lightgrey", backgroundColor:"white"}}>
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
                            options.ownedRestaurants? <ManagerOwnedRestaurants restaurants={user.ownedRestaurants}/>:
                            options.seeRestaurant? <RestaurantPage restaurantId={restaurantId}/>:
                            options.reviews? <OwnedRestaurantReviews restaurants={user.ownedRestaurants}/>: null
                        }
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )

}

export default ManagerMenu