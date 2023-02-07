import { Container, Table } from "react-bootstrap"


const ClientOrderList = ({orders}) => {

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    const transformOrderStatus = (status) => {
        return (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()).replaceAll("_", " ")
    }

    return(
        <Container style={boxStyle}>
            <h3 style={{textAlign: "center"}}>Orders</h3> <br/>
            <Table responsive hover bordered>
                <thead>
                    <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Value</th>
                        <th>Status</th>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders !== undefined? orders.map((order, i) => <tr key={i}>
                            <th>{order.number}</th>
                            <th>{order.dateTime}</th>
                            <th>{order.value + order.deliveryTax}</th>
                            <th>{transformOrderStatus(order.status)}</th>
                            <th>
                                <a href={`/client-account/orders/${order.id}`}>See order</a>
                            </th>
                        </tr>): null
                    }
                </tbody>
            </Table>
        </Container>
    )

}

export default ClientOrderList