import { Fragment, useEffect, useMemo, useState, useCallback } from "react"
import { Button} from "react-bootstrap"
import Order from "../Order"


const DeliverCurrentOrder = ({deliver}) => {

    const [currentOrder, setCurrentOrder] = useState({})  
    const [nextStatus, setNextStatus] = useState("")

    const allStatuses = useMemo(() => ["RECEIVED", "PICKED_UP", "ON_THE_WAY", "DELIVERED"], [])

    const getNextStatus = useCallback(() => {
        return allStatuses[allStatuses.indexOf(currentOrder.status) + 1]}, [allStatuses, currentOrder]
    )
    
    useEffect(() => {
        if(deliver !== undefined && deliver.orders !== undefined) {
            const orderInProgress = deliver.orders.filter(order => order.status !== "DELIVERED")[0]
            setCurrentOrder(orderInProgress)
            if(orderInProgress !== undefined) {
                setNextStatus(getNextStatus())   
            }
        }
    }, [deliver, getNextStatus])


    const changeStatus = () => {
        console.log(currentOrder.id)
        console.log(nextStatus)
        fetch(`/order/change-status/${currentOrder.id}/${nextStatus}`, {
            method: "PATCH"
        }).then(response => response.json()).then(response => {
            setNextStatus(getNextStatus())
            console.log(response)
            setCurrentOrder(response)
        })
    }

    return(
        <Fragment>
            {
                currentOrder !== undefined? <Fragment>
                    <Button onClick={changeStatus}>Change status to {nextStatus}</Button>
                    <Order orderId={currentOrder.id}/>
                </Fragment>: null
            }
           
        </Fragment>
    )
}

export default DeliverCurrentOrder