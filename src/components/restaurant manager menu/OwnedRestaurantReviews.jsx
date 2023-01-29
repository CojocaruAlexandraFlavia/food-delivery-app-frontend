import { Fragment } from "react"
import { Container } from "react-bootstrap"
import { Rating } from 'react-simple-star-rating'


const OwnedRestaurantReviews = ({restaurants}) => {


    return(
        <Container>
             {
                restaurants !== undefined? restaurants.map((restaurant, id) => <Fragment key={id}>
                    <div>
                        <h3>{restaurant.name}</h3>
                        <h4>Reviews:</h4>
                        {
                            restaurant.reviews.map((review, index) => <Fragment key={index}>
                                <Rating readonly initialValue={review.stars}/>
                                <h5>Comment: {review.comment}</h5>
                                <h5>Client: {review.clientFirstName} {review.clientLastName}</h5>
                            </Fragment>)
                        }
                    </div>
                </Fragment>): null
            }
        </Container>
    )

}

export default OwnedRestaurantReviews