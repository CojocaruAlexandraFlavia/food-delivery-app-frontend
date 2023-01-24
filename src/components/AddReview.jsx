import { useState } from "react"
import { useContext } from "react"
import { Button, Container, Form } from "react-bootstrap"
import { Rating } from 'react-simple-star-rating'
import UserContext from "./context/UserContext"


const AddReview = (props) => {

    const {user} = useContext(UserContext)
    const [review, setReview] = useState({
        stars: 1,
        comment: "",
        clientUserId: user.id,
        restaurantId: props.restaurantId
    })
    const [added, setAdded] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const saveReview = () => {
        //setReview({...review, clientUserId: 1})
        console.log(review)

        if(review.stars <= 1) {
            setErrorMessage("Minimum one star")
        } else {
            fetch("/restaurant/add-review", {
                body: JSON.stringify(review),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept":"application/json"
                }
            }).then(response => {
                if(response.status === 200) {
                    setAdded(true)
                    setErrorMessage("")
                    setTimeout(() => {
                        setAdded(false)
                    }, 3000)
                } else {
                    setErrorMessage("Already voted")
                }
            })
        }
    }

    const handleChangeStars = (rate) => {
        console.log(rate)
        setReview({...review, stars: rate})
        setErrorMessage("")
    }

    return(
        <Container>
            <Form>
                <Form.Group>
                    <Form.Label>Stars</Form.Label>
                    <Rating showTooltip={false} transition allowHover ratingValue={review.stars} onClick={handleChangeStars}/>
                    {
                        errorMessage? <h3>{errorMessage}</h3>: null
                    }
                </Form.Group>
                <Form.Group>
                    <Form.Label>Comment</Form.Label>
                    <Form.Control value={review.comment} onChange={(e) => setReview({...review, comment: e.target.value})}/>
                </Form.Group>
                <Button variant="success" onClick={saveReview}>Add review</Button>
                {
                    added? <h3 style={{color: "green"}}>Review added successfully</h3>: null
                }
                
            </Form>
        </Container>
    )
}

export default AddReview