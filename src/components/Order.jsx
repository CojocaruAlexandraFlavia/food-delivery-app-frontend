import { Fragment, useEffect } from "react"
import { useState } from "react"
import { Col, Container, Row, Table } from "react-bootstrap"
import { useParams } from "react-router"
import LoadingSpinner from "./util/LoadingSpinner"

const Order = ({orderId}) => {

    const {idParam} = useParams()
    let id = idParam !== undefined ? idParam : orderId
   

    const [order, setOrder] = useState({})
    const [deliveryUser, setDeliveryUser] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const controller = new AbortController()
        const signal = controller.signal

        fetch(`/order/get-by-id/${id}`, {
            signal: signal
        }).then(response => response.json()).then(response => {
            setOrder(response)
            setLoading(false)
            fetch(`/order/delivery-user/${response.deliveryUserId}`, {
                signal: signal
            }).then(r => r.json()).then(r => setDeliveryUser(r))
        })

        return () => {
            controller.abort()
        }
    }, [id])

    const calculateProductPriceWithDiscount = (orderProduct) => {
        return orderProduct.productDto.price - orderProduct.productDto.discount / 100 * orderProduct.productDto.price
    }

    return(
        <Container>
            {
                loading? <LoadingSpinner/> : 
                <Fragment>
                    <h2>Order #{order.number}</h2>
                    <h2>Status: {order.status.replaceAll("_", " ")}</h2>
                    <Table responsive bordered hover>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                order.products.map((orderProduct, i) => <tr key={i}>
                                    <th>{orderProduct.productDto.name}</th>
                                    <th>{orderProduct.quantity}</th>
                                    <th>{calculateProductPriceWithDiscount(orderProduct).toFixed(2)}</th>
                                    <th>{(calculateProductPriceWithDiscount(orderProduct) * orderProduct.quantity).toFixed(2)}</th>
                                </tr>)
                            }
                            <tr>
                                <td colSpan={3}>
                                    <div style={{paddingLeft: "1rem"}}>
                                        <p style={{paddingBottom: "2px"}}>Subtotal</p>
                                        <p style={{paddingBottom: "2px"}}>Delivery tax</p>
                                        <p style={{paddingBottom: "2px"}}>Total</p>
                                    </div>
                                </td>
                                <td colSpan={3}>
                                <div>
                                    <p style={{paddingBottom: "2px"}}>{order.value !== undefined ? order.value.toFixed(2): ""}</p>
                                    <p style={{paddingBottom: "2px"}}>{order.deliveryTax !== undefined? order.deliveryTax.toFixed(2): ""}</p>
                                    <p style={{paddingBottom: "2px"}}>{order.value !== undefined? (order.value + order.deliveryTax).toFixed(2): ""}</p>
                                </div>                            
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <Row>
                        <Col md={6}>
                            <div style={{ boxShadow:"1px 1px 4px 4px grey", padding:"10px"}}>
                                <h2>Delivery user</h2>
                                <h4>Name: {deliveryUser.firstName} {deliveryUser.lastName}</h4>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div style={{ boxShadow:"1px 1px 4px 4px grey", padding:"10px"}}>
                                <h3>Delivery address</h3>
                                <h4>{order.deliveryAddress.address} <br/>
                                    {order.deliveryAddress.city}, {order.deliveryAddress.zipCode}
                                </h4>
                            </div>
                        </Col>
                    </Row>
                    <div style={{ boxShadow:"1px 1px 4px 4px grey", padding:"10px", marginTop:"5%"}}>
                        <h2>Payment method: {order.paymentType.replaceAll("_", " ")}</h2>
                    </div>
            </Fragment>
        }
        </Container>
    )
}

export default Order