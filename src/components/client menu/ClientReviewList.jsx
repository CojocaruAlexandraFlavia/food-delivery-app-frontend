import { Fragment } from "react"
import { Container } from "react-bootstrap"
import { Rating } from "react-simple-star-rating"


const ClientReviewList = ({reviews}) => {

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Container style={boxStyle}>
            <h2 style={{textAlign:"center"}}>Reviews</h2> <br/>
            {
                reviews !== undefined ? reviews.map((review, i) => <div key={i} style={boxStyle}>
                    <h3>Restaurant: {review.restaurantName}</h3>
                    {/* <h4>{review.clientFirstName} {review.clientLastName}</h4> */}
                    <div style={{display: "flex"}}>
                        <h5 style={{alignSelf:"center"}}>Stars: </h5>
                        <Rating readonly initialValue={review.stars}/>
                    </div>
                    <h5>Comment: {review.comment}</h5>
                </div>): null
            }
        </Container>
    )

}

export default ClientReviewList