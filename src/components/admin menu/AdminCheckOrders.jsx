import { Fragment, useEffect } from "react"
import { useState } from "react"


const AdminCheckOrders = () => {

    const [checkOrders, setCheckOrders] = useState({})

    useEffect(() => {
        fetch("/order/check-total-count")
            .then(response => response.json())
            .then(response => setCheckOrders(response))
    }, [])

    return(
        <Fragment>
            <h4>Total number of orders: {checkOrders.numberOfOrders}</h4>
            <h4>Total value of orders: {checkOrders.totalCount} </h4>
        </Fragment>
    )

}

export default AdminCheckOrders