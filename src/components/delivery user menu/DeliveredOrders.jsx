import { Container, Table } from "react-bootstrap"


const DeliveredOrders = ({orders}) => {


    return(
        <Container>
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
    )

}

export default DeliveredOrders