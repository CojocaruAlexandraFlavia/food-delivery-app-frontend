import React, { Fragment, useState, useContext, useEffect} from "react"
import { Container, Row, Col, Button, Modal } from "react-bootstrap"
import UserContext from "../context/UserContext"
import Order from "../Order"

const NewReceivedOrders = () => {
    const [newOrders, setNewOrders] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [orderToSee, setOrderToSee] = useState({})

    const {user} = useContext(UserContext)

    useEffect(() => {
        fetch("/order/get-by-status/received")
            .then(response => response.json())
            .then(response => setNewOrders(response))
    }, [])

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    const openOrderModal = (order) => {
        setOrderToSee(order)
        setShowModal(true)
    }

    const hideOrderModal = () => {
        setShowModal(false)
        setOrderToSee({})
    }

    const assignOrder = () => {
        fetch(`/order/assign-deliver-to-order/${orderToSee.id}/${user.id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        })
            .then(response => response.json())
            .then(response => {
                setOrderToSee(response)
                hideOrderModal()
            })
    }

    return(
        <Container style={boxStyle}>
            <Fragment>
                <h3 style={{textAlign:"center"}}>New orders</h3> <br/>
                {
                    newOrders !== undefined && newOrders.length > 0? newOrders.map((order, i) => <Fragment key={i}>
                        <div style={boxStyle}>
                            <Row>
                                <Col md={9}>
                                    <h5>Restaurant: {order.products[0].productDto.restaurantName}</h5>
                                    <h5>Value: &euro;{order.value}</h5>
                                </Col>
                                <Col md={3} style={{display:"flex"}}>
                                    <Button style={{height:"fit-content", alignSelf:"center"}} onClick={() => openOrderModal(order)}>See order details</Button>
                                </Col>
                            </Row>
                        </div> <br/>
                    </Fragment>): <h5>There are no new orders...</h5>
                }
                <Modal show={showModal} onHide={hideOrderModal} scrollable animation>
                    <Modal.Header closeButton>
                        {
                            orderToSee.status === "RECEIVED" && orderToSee.deliveryUserId === undefined && 
                                    orderToSee.deliveryAddress.city.toLowerCase() === user.preferredCity.toLowerCase()? <Row>
                                <Col md={6}>Order #{orderToSee.number}</Col>
                                <Col md={6}>
                                    <Button onClick={assignOrder}>Assign</Button>
                                </Col>
                            </Row>: `Order #${orderToSee.number}`
                        }
                       </Modal.Header>
                    <Modal.Body>
                        <Order orderId={orderToSee.id}/>
                    </Modal.Body>
                </Modal>
            </Fragment>
        </Container>
    )
}

export default NewReceivedOrders