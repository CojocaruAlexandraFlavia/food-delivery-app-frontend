import { Fragment, useState, useCallback, useEffect } from "react"
import { Button, Container, Modal } from "react-bootstrap"
import UpdateRestaurant from "./UpdateRestaurant"



const ManageRestaurants = () => {

    const [allRestaurants, setAllRestaurants] = useState([])
    const [deleted, setDeleted] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const getAllRestaurants = useCallback(() => {
        fetch("/restaurant/get-all")
            .then(response => response.json())
            .then(response => setAllRestaurants(response))
    }, [])

    useEffect(() => {
        getAllRestaurants()
    }, [getAllRestaurants])
    
    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"5px"}

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

    return(
        <Container>
            {
                allRestaurants.map((restaurant, i) => <Fragment key={i}>
                    <div style={boxStyle}>
                        <h3>{restaurant.name}</h3>
                        <h3>Locations:</h3>
                        {
                            restaurant.locations.map((location, index) => <Fragment key={index}>
                                <div style={boxStyle}>
                                    <h5>{location.address}, {location.city}</h5>
                                    <h5>Status: {location.availability.toString() === "true" ? "Available": "Unavailable"}</h5>
                                </div> <br/>
                            </Fragment>
                            )
                        } <br/>
                        {
                            deleted? <h3>Deleted successfully</h3>: null
                        }
                        <Button variant="danger" onClick={() => deleteRestaurant(restaurant.id)}>Delete</Button>
                        <Button onClick={() => setEditModal(true)}>Edit</Button>
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