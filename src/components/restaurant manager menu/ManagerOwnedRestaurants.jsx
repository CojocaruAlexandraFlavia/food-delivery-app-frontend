import { Fragment, useEffect, useState } from "react"
import { Container, Row, Col, Button } from "react-bootstrap"
import { AiOutlineArrowUp, AiOutlineArrowDown} from "react-icons/ai"
import ProductsPage from "../ProductsPage"
import { Rating } from 'react-simple-star-rating'
import AddProduct from "./AddProduct"


const ManagerOwnedRestaurants = ({restaurants}) => {

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}
    const [seeDetails, setSeeDetails] = useState([])

    useEffect(() => {
        if(restaurants !== undefined) {
            setSeeDetails(new Array(restaurants.length).fill(false, 0))
        }
    }, [restaurants])

    const handlePressArrow = (value, index) => {
        let updatedArray = []
        for(let i = 0; i < seeDetails.length; i++) {
            if (i === index) {
                updatedArray.push(value)
            } else {
                updatedArray.push(seeDetails[i])
            }
        }
        setSeeDetails(updatedArray)
    }

    return(
        <Container style={boxStyle}>
            <h2>Owned restaurants</h2> <br/>
            {
                restaurants !== undefined ? restaurants.map((restaurant, i) => <Fragment key={i}>
                    <div style={boxStyle}>
                        <Row>
                            <Col md={11}>
                                <h3>{restaurant.name}</h3>
                                {
                                    seeDetails[i]? <Fragment>
                                        <h4>Locations:</h4>
                                        {
                                             restaurant.locations.map((location, index) => <Fragment key={index}>
                                                <div style={boxStyle}>
                                                    <h6>{location.address}, {location.city}</h6>
                                                </div> <br/>
                                             </Fragment>)
                                        } <br/>
                                        <div style={{display:"flex", justifyContent:"space-between"}}>
                                            <h4>Products</h4>
                                            <AddProduct restaurantId={restaurant.id}/>
                                        </div> <br/>
                                        <ProductsPage restaurantId={restaurant.id}/><br/>
                                        <h4>Reviews</h4> <br/>
                                        {
                                            restaurant.reviews.map((review, index) => <Fragment key={index}>
                                                <div style={boxStyle}>
                                                    <Rating readonly initialValue={review.stars}/>
                                                    <h6>Comment: {review.comment}</h6>
                                                    <h6>Client: {review.clientFirstName} {review.clientLastName}</h6>
                                                </div> <br/>
                                            </Fragment> )
                                        }
                                    </Fragment>: null
                                }
                            </Col>
                            <Col md={1}>
                                {
                                    seeDetails[i]? <Button onClick={() => handlePressArrow(false, i)}>
                                        <AiOutlineArrowUp/>
                                    </Button> : <Button  onClick={() => handlePressArrow(true, i)}>
                                        <AiOutlineArrowDown/>
                                    </Button>
                                       
                                }
                            </Col>
                        </Row>
                    </div> <br/>
                </Fragment>): null
            }
        </Container>
    )
}
export default ManagerOwnedRestaurants