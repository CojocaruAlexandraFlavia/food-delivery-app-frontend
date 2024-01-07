import { Fragment, useState, useCallback, useEffect } from "react"
import { Button, Col, Container, Modal, ModalBody, ModalFooter, Row } from "react-bootstrap"
import ProductsPage from "../ProductsPage"
import UpdateRestaurant from "./UpdateRestaurant"
// import { AiOutlineArrowUp, AiOutlineArrowDown} from "react-icons/ai"
import {Rating} from "react-simple-star-rating"

const ManageRestaurants = () => {

    const [allRestaurants, setAllRestaurants] = useState([])
    const [editModal, setEditModal] = useState(false)
    const [showDeleteConfirmModal, setShowConfirmDeleteModal] = useState(false)
    const [seeDetails, setSeeDetails] = useState([])
    const [restaurantIdToEdit, setRestaurantIdToEdit] = useState(0)
    const [restaurantIdToDelete, setRestaurantIdToDelete] = useState(0)

    const getAllRestaurants = useCallback(() => {
        fetch("/restaurant/get-all", {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        })
            .then(response => response.json())
            .then(response => {
                setAllRestaurants(response)
                setSeeDetails(new Array(response.length).fill(false, 0))
            })
    }, [])

    useEffect(() => {
        getAllRestaurants()
    }, [getAllRestaurants])

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
    
    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    const deleteRestaurant = (id) => {
        fetch( `/restaurant/delete-by-id/${id}`, {
            method: "DELETE"
        }).then(response => {
            if(response.status === 200) {
                fetch("/restaurant/get-all", {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }})
                .then(response => response.json())
                .then(response => {
                    setAllRestaurants(response)
                    setShowConfirmDeleteModal(false)                   
                })
            }
        })
    }

    const closeModal = () => {
        setEditModal(false)
    }

    const changeLocationAvailability = (locationId) => {
        fetch(`/restaurant/change-location-availability/${locationId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        }).then(response => response.json()).then(response => setAllRestaurants(response))
    }

    return(
        <Container style={boxStyle}>
            <h2 style={{textAlign:"center"}}>Restaurants</h2> <br/>
            {
                allRestaurants.map((restaurant, i) => <Fragment key={i}>
                    <div style={boxStyle}>
                        <Row>
                           <Col md={11}>
                                <div style={{display:"flex", justifyContent:"space-between"}}>
                                    <h3>{restaurant.name}</h3>
                                    <div>
                                        <Button variant="danger" onClick={() => {
                                            setRestaurantIdToDelete(restaurant.id)
                                            setShowConfirmDeleteModal(true)
                                        }}>Delete</Button>
                                        <Button onClick={() => {
                                            setRestaurantIdToEdit(restaurant.id)
                                            setEditModal(true)
                                        }}>Edit</Button>
                                    </div>                       
                                </div>
                            { seeDetails[i]? <Fragment>
                                <h4>Locations:</h4>
                                    {
                                        restaurant.locations.map((location, index) => <Fragment key={index}>
                                            <div style={boxStyle}>
                                                <h6>{location.address}, {location.city}</h6>
                                                <h6>Status: {location.availability.toString() === "true" ? "Available": "Unavailable"}</h6>
                                                <Button onClick={() => changeLocationAvailability(location.id)}>Change location availability</Button>
                                            </div> <br/>
                                        </Fragment>)
                                    } <br/><br/>                                   
                                    <h4>Products</h4> <br/>
                                    <ProductsPage restaurantId={restaurant.id}/> <br/>
                                    <h4>Reviews</h4> <br/>
                                    {
                                        restaurant.reviews.map((review, index) => <Fragment key={index}>
                                            <div style={boxStyle}>
                                                <Rating readonly initialValue={review.stars}/>
                                                <h6>Comment: {review.comment}</h6>
                                                <h6>Client: {review.clientFirstName} {review.clientLastName}</h6>
                                            </div> <br/>
                                        </Fragment>)
                                    }       
                            </Fragment>: null
                        }       
                            </Col> 
                            <Col md={1}>
                                {
                                    //seeDetails[i]? <Button onClick={() => handlePressArrow(false, i)}>
                                        //<AiOutlineArrowUp/>
                                    //</Button> : <Button  onClick={() => handlePressArrow(true, i)}>
                                        //<AiOutlineArrowDown/>
                                    //</Button>
                                       
                                }
                            </Col>                            
                        </Row>

                                                        
                    </div> <br/>
                    <Modal show={editModal} onHide={closeModal}>
                        <Modal.Header closeButton>Edit restaurant</Modal.Header>
                        <Modal.Body>
                            <UpdateRestaurant getAllRestaurants={getAllRestaurants} setEditModal={setEditModal} restaurantId={restaurantIdToEdit}/>
                        </Modal.Body>
                    </Modal>      
                    <Modal show={showDeleteConfirmModal} onHide={() => setShowConfirmDeleteModal(false)}>
                        <ModalBody>
                            Confirm restaurant deletion?
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="danger" onClick={() => deleteRestaurant(restaurantIdToDelete)}>Confirm delete</Button>
                            <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>             
                </Fragment>)
            }
          
        </Container>
    )
}

export default ManageRestaurants