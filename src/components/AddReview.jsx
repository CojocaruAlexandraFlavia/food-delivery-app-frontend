import { Fragment } from "react"
import { useState } from "react"
import { useContext } from "react"
import { Button, Container, Form, Modal } from "react-bootstrap"
import { Rating } from 'react-simple-star-rating'
import UserContext from "./context/UserContext"


const AddReview = ({restaurantId, getRestaurantById}) => {

    const {user} = useContext(UserContext)
    const [showModal, setShowModal] = useState(false)
    const [review, setReview] = useState({
        stars: 1,
        comment: "",
        clientUserId: user.id,
        restaurantId: restaurantId
    })
    const [added, setAdded] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const saveReview = () => {
        //setReview({...review, clientUserId: 1})

        if(review.stars <= 1) {
            setErrorMessage("Minimum one star")
        } else {
            fetch("/restaurant/add-review", {
                body: JSON.stringify(review),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept":"application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            }).then(response => {
                if(response.status === 200) {
                    setAdded(true)
                    getRestaurantById()
                    setErrorMessage("")
                    setTimeout(() => {
                        setAdded(false)
                        setShowModal(false)
                    }, 3000)
                } else {
                    setErrorMessage("Already added review for this restaurant!")
                }
            })
        }
    }

    const handleChangeStars = (rate) => {
        setReview({...review, stars: rate})
        setErrorMessage("")
    }

    const onHide = () => {
        setShowModal(false)
        setAdded(false)
        setErrorMessage("")
        setReview({
            stars: 1,
            comment: "",
            clientUserId: user.id,
            restaurantId: restaurantId
        })
    }

    return(
        <Fragment>
            <Button onClick={() => setShowModal(true)}>
                Add review
            </Button>
            <Modal show={showModal} onHide={onHide}>
                <Modal.Header closeButton>Add review</Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form>
                            <Form.Group>
                                <Form.Label>Stars</Form.Label>
                                <Rating showTooltip={false} transition allowHover ratingValue={review.stars} onClick={handleChangeStars}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Comment</Form.Label>
                                <Form.Control value={review.comment} onChange={(e) => setReview({...review, comment: e.target.value})}/>
                            </Form.Group>   <br/>                       
                            {
                                added? <h3 style={{color: "green"}}>Review added successfully</h3>: null
                            }               
                            {
                                errorMessage? <h3 style={{color:"red"}}>{errorMessage}</h3>: null
                            }             
                        </Form>
                    </Container>    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={saveReview}>Add review</Button>
                </Modal.Footer>
            </Modal>
          
        </Fragment>
        
    )
}

export default AddReview