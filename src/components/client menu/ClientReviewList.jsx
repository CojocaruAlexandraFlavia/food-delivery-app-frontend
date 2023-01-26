import { Fragment } from "react"
import { Rating } from "react-simple-star-rating"


const ClientReviewList = ({reviews}) => {

    return(
        <Fragment>
            {
                reviews !== undefined ? reviews.map((review, i) => <div key={i}>
                    <h3>Restaurant: {review.restaurantName}</h3>
                    <h4>{review.clientFirstName} {review.clientLastName}</h4>
                    <Rating readonly initialValue={review.stars}/>
                    <h5>{review.comment}</h5>
                </div>): null
            }
        </Fragment>
    )

}

export default ClientReviewList