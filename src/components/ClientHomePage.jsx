import React, { Fragment, useContext } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import ClientNavbar from "./client menu/ClientNavbar";
import UserContext from "./context/UserContext";

const ClientHomePage = () => {

    const {user, setUser} = useContext(UserContext)
    const [restaurants, setRestaurants] = useState([])
    const [showChangeCityModal, setShowChangeCityModal] = useState(false)
    const [newCity, setNewCity] = useState("")
    const [error, setError] = useState("")

    const getRestaurantsByCity = useCallback(() => {
        const token = sessionStorage.getItem("token")

        fetch(`/restaurant/get-all-by-city/${user.preferredCity}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(response => {
            const availableRestaurants = response.filter(r => r.locations.filter(l => l.availability.toString() === "true").length > 0)
            setRestaurants(availableRestaurants)
        })
    }, [user.preferredCity])

    const handleChangePreferredCity = () => {
        if (newCity === "") {
            setError("Required field")
        } else {
            fetch(`/user/change-preferred-city/?newCity=${newCity}&userId=${user.id}`, {
                method:"PATCH",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            }).then(response => response.json()).then(response => {
                setUser(response)
                getRestaurantsByCity()
                onHideModal()
            })
        }
    }

    useEffect(() => {
       getRestaurantsByCity()
       setNewCity(user.preferredCity)
    }, [getRestaurantsByCity, user.preferredCity])

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    const onHideModal = () => {
        setShowChangeCityModal(false)
        setNewCity(user.preferredCity)
        setError("")
    }

    return(
        <Fragment>
            <ClientNavbar/> <br/>
            {/* <div style={{backgroundImage:`url("https://valentinvasile.ro/wp-content/uploads/2020/01/restaurant-food-salat-2.jpg")`}}> */}
                <Container style={boxStyle}>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <h3>Restaurants from your preferred city: {user.preferredCity}</h3>
                        <Button onClick={() => setShowChangeCityModal(true)}>Change preferred city</Button>
                    </div>
                    <br/>
                    {
                        restaurants.map((restaurant, i) => <Fragment key={i}>
                                <div style={boxStyle}>
                                    <Row>
                                        <Col md={10}>
                                            <h5>{restaurant.name}</h5>
                                            <div style={{display:"flex"}}>
                                                <h5 style={{alignSelf:"center"}}>Rating: </h5>
                                                <Rating readonly initialValue={restaurant.rating} allowFraction size={25}/>
                                                <h5 style={{alignSelf:"center"}}>({restaurant.rating}/5.0)</h5>
                                            </div>
                                        </Col>
                                        <Col md={2} style={{display:"flex"}}>
                                            <a href={`/restaurant/${restaurant.id}`} style={{alignSelf:"center"}}>See restaurant</a>
                                        </Col>
                                    </Row>
                                    
                                </div>                                           
                        </Fragment>)
                    }
                    <Modal show={showChangeCityModal} onHide={onHideModal}>
                        <Modal.Header closeButton>Change preferred city</Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Control onChange={(e) => setNewCity(e.target.value)} value={newCity} isInvalid={error}/>
                                <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={handleChangePreferredCity} variant="success">Change</Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            {/* </div> */}
            
        </Fragment>
    )

}

export default ClientHomePage