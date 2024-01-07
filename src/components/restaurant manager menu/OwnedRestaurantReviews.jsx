import { Fragment, useState, useEffect } from "react"
import { Col, Container, Row, Button } from "react-bootstrap"
import { Rating } from 'react-simple-star-rating'
// import { AiOutlineArrowUp, AiOutlineArrowDown} from "react-icons/ai"


const OwnedRestaurantReviews = ({restaurants}) => {

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px", backgroundColor:"white"}

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

    const buildRestaurantRatingText = (restaurant) => {
        return restaurant.name + " (" + restaurant.rating.toFixed(2) + "/5.00)"
    }

    return(
        <Container style={boxStyle}>
            <h2 style={{textAlign:"center"}}>Owned restaurants reviews</h2> <br/>
             {
                restaurants !== undefined? restaurants.map((restaurant, i) => <Fragment key={i}>
                        <div style={boxStyle}>
                            <Row>
                                <Col md={11}>
                                    <h4 style={{textAlign:"center"}}>{buildRestaurantRatingText(restaurant)}</h4> <br/>
                                    {
                                        seeDetails[i]? <div>                                
                                        {
                                            restaurant.reviews.map((review, index) => <Fragment key={index}>
                                                <div style={boxStyle}>
                                                    <Rating readonly initialValue={review.stars}/>
                                                    <h6>Comment: {review.comment}</h6>
                                                    <h6>Client: {review.clientFirstName} {review.clientLastName}</h6>
                                                </div> <br/>
                                            </Fragment> )
                                        }
                                    </div>: null
                                    }
                                </Col>
                                <Col md={1}>
                                {
                                    //seeDetails[i]? <Button onClick={() => handlePressArrow(false, i)}>
                                       // <AiOutlineArrowUp/>
                                    //</Button> : <Button  onClick={() => handlePressArrow(true, i)}>
                                       // <AiOutlineArrowDown/>
                                   // </Button>
                                       
                                }
                                </Col>
                            </Row>
                          
                        </div> <br/>
                </Fragment> ): null
            }
        </Container>
    )

}

export default OwnedRestaurantReviews