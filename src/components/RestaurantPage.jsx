import React from "react";
import { useEffect, useState, Fragment } from "react";
import { Container, Row, Col} from "react-bootstrap"
import { useParams } from "react-router"
import LoadingSpinner from "./util/LoadingSpinner"
import ProductsPage from "./ProductsPage"
import { Rating } from "react-simple-star-rating";
import ClientNavbar from "./client menu/ClientNavbar";


const RestaurantPage = ({restaurantId}) => {

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    const {idParam} = useParams()
    let id = idParam !== undefined ? idParam : restaurantId
  
    const[restaurant, setRestaurant] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/restaurant/get-by-id/${id}`)
            .then(response => response.json()).then(response => {
                setRestaurant(response)
                setLoading(false)
            })
    }, [id])

    return(
        <Fragment>
            <ClientNavbar/> <br/> <br/>
            <Container style={boxStyle}>
            {
                loading? <LoadingSpinner/> : 
                <Fragment>
                
                    {/* <img src='src/images/restaurants/desert.jpg' alt ="img" /> */}
                        <h2>Restaurant {restaurant.name}</h2>
                        <h5>Phone number: {restaurant.phoneNumber}</h5>
                        <div style={{display:"flex"}}>
                            <h5 style={{alignSelf:"center"}}>Rating: </h5>
                            <Rating readonly initialValue={restaurant.rating} allowFraction size={25}/>
                            <h5 style={{alignSelf:"center"}}>({restaurant.rating}/5.0)</h5>
                        </div>
                        <br/>
                        <h5>Locations: </h5> <br/>
                        {
                            restaurant.locations.map((location, index) => <Fragment key={index}>
                                <div style={boxStyle}>
                                    <h6>{location.address}, {location.city}</h6>
                                    <h6>Status: {location.availability.toString() === "true" ? "Available": "Unavailable"}</h6>
                                </div>
                                <br/>
                            </Fragment>)
                        } <br/>
                        <h5>Reviews:</h5>
                            {
                                restaurant.reviews.map((review, j) => <Fragment key={j}>
                                    <div style={boxStyle}>
                                        <Row>
                                            <Col md={3} style={{display:"flex"}}>
                                                <h6 style={{alignSelf:"center"}}>{review.clientFirstName} {review.clientLastName}</h6>
                                            </Col>
                                            <Col md={9}>
                                                <Rating size={25} readonly initialValue={review.stars} allowFraction/>
                                                <h6>Comment: {review.comment}</h6>
                                            </Col>
                                        </Row>                                                                               
                                    </div>                                   
                                </Fragment>)
                            }
                            <br/> <br/>
                            <h5>Products:</h5> <br/>
                        <ProductsPage  restaurantId={restaurant.id}/>   
                        
                </Fragment>
            }
            </Container>
        </Fragment>
        
    )

}
export default RestaurantPage
