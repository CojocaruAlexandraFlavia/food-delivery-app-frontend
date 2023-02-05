import { Fragment, useState, useCallback, useEffect } from "react"
import { Button, Container, Modal, ModalBody, ModalFooter } from "react-bootstrap"
import ProductsPage from "../ProductsPage"
import UpdateRestaurant from "./UpdateRestaurant"

const ManageRestaurants = () => {

    const [allRestaurants, setAllRestaurants] = useState([])
    const [deleted, setDeleted] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [showDeleteConfirmModal, setShowConfirmDeleteModal] = useState(false)

    const getAllRestaurants = useCallback(() => {
        fetch("/restaurant/get-all")
            .then(response => response.json())
            .then(response => setAllRestaurants(response))
    }, [])

    useEffect(() => {
        getAllRestaurants()
    }, [getAllRestaurants])
    
    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    const deleteRestaurant = (id) => {
        fetch( `/restaurant/delete-by-id/${id}`, {
            method: "DELETE"
        }).then(response => {
            if(response.status === 200) {
                getAllRestaurants()
                setDeleted(true)
                setTimeout(() => {
                    setDeleted(false)
                }, 5000)
            }
        })
    }

    const closeModal = () => {
        setEditModal(false)
    }

    const changeLocationAvailability = (locationId) => {
        fetch(`/restaurant/change-location-availability/${locationId}`, {
            method: "PATCH"
        }).then(response => response.json()).then(response => setAllRestaurants(response))
    }

    return(
        <Container style={boxStyle}>
            <h2 style={{textAlign:"center"}}>Restaurants</h2> <br/>
            {
                allRestaurants.map((restaurant, i) => <Fragment key={i}>
                    <div style={boxStyle}>
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                            <h3>{restaurant.name}</h3>
                            <div>
                                <Button variant="danger" onClick={() => setShowConfirmDeleteModal(true)}>Delete</Button>
                                <Button onClick={() => setEditModal(true)}>Edit</Button>
                            </div>                       
                        </div>                      
                        <h4>Locations:</h4>
                        {
                            restaurant.locations.map((location, index) => <Fragment key={index}>
                                <div style={boxStyle}>
                                    <h6>{location.address}, {location.city}</h6>
                                    <h6>Status: {location.availability.toString() === "true" ? "Available": "Unavailable"}</h6>
                                    <Button onClick={() => changeLocationAvailability(location.id)}>Change location availability</Button>
                                </div> <br/>
                                <Modal show={showDeleteConfirmModal} onHide={() => setShowConfirmDeleteModal(false)}>
                                    <ModalBody>
                                        Confirm restaurant deletion?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="danger" onClick={() => deleteRestaurant(restaurant.id)}>Confirm delete</Button>
                                        <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>Cancel</Button>
                                    </ModalFooter>
                                </Modal>
                            </Fragment>
                            )
                        } <br/>
                        {
                            deleted? <h3>Deleted successfully</h3>: null
                        }
                        <h4>Products:</h4>
                        <ProductsPage restaurantId={restaurant.id}/>
                    </div> <br/>
                    <Modal show={editModal} onHide={closeModal}>
                        <Modal.Header closeButton>Edit restaurant</Modal.Header>
                        <Modal.Body>
                            <UpdateRestaurant restaurantId={restaurant.id}/>
                        </Modal.Body>
                    </Modal>
                    
                </Fragment>)
            }
          
        </Container>
    )
}

export default ManageRestaurants