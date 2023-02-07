import { Container, Table } from "react-bootstrap"
import { Fragment } from "react"


const DeliveredOrders = ({orders}) => {

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Fragment>
            <Container style={boxStyle}>
                <h3 style={{textAlign:"center"}}>Delivered orders</h3> <br/>
                <Table responsive hover bordered>
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Date</th>
                            <th>Value</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders !== undefined? orders.map((order, i) => <tr key={i}>
                                <th>{order.number}</th>
                                <th>{order.dateTime}</th>
                                <th>{order.value + order.deliveryTax}</th>
                                <th>
                                    <a href={`/deliver-account/delivered-orders/${order.id}`}>See order</a>
                                </th>
                            </tr>): null
                        }
                    </tbody>
                </Table>
            </Container>
        </Fragment>
        
    )

}

export default DeliveredOrders