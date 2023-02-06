import { Fragment } from "react"
import { Container } from "react-bootstrap"
import { Rating } from 'react-simple-star-rating'


const OwnedRestaurantReviews = ({restaurants}) => {

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Container style={boxStyle}>
            <h2 style={{textAlign:"center"}}>Owned restaurants reviews</h2> <br/>
             {
                restaurants !== undefined? restaurants.map((restaurant, id) => <Fragment key={id}>
                        <div style={boxStyle}>
                            <div>
                                <h4 style={{textAlign:"center"}}>{restaurant.name}</h4> <br/>
                                {/* <h5>Reviews:</h5> */}
                                {
                                    restaurant.reviews.map((review, index) => <Fragment key={index}>
                                        <div style={boxStyle}>
                                            <Rating readonly initialValue={review.stars}/>
                                            <h6>Comment: {review.comment}</h6>
                                            <h6>Client: {review.clientFirstName} {review.clientLastName}</h6>
                                        </div> <br/>
                                    </Fragment> )
                                }
                            </div>
                        </div> <br/>
                </Fragment> ): null
            }
        </Container>
    )

}

export default OwnedRestaurantReviews