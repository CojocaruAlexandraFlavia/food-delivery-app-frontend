import { Fragment, useEffect } from "react"
import { useState } from "react"
import { Container } from "react-bootstrap"


const AdminCheckOrders = () => {

    const [checkOrders, setCheckOrders] = useState({})

    useEffect(() => {
        fetch("/order/check-total-count")
            .then(response => response.json())
            .then(response => setCheckOrders(response))
    }, [])

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Container style={boxStyle}>
            <h2 style={{textAlign:"center"}}>Check orders total count</h2> <br/>
            <h5>Total number of orders: {checkOrders.numberOfOrders}</h5>
            <h5>Total value of orders: {checkOrders.totalCount} </h5>
            <h5>Total number of ordered products: {checkOrders.numberOfProducts}</h5>
        </Container>
    )

}

export default AdminCheckOrders