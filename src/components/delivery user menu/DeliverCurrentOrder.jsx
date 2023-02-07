import { Fragment, useEffect, useMemo, useState, useCallback } from "react"
import { Button} from "react-bootstrap"
import Order from "../Order"


const DeliverCurrentOrder = ({deliver}) => {

    const [currentOrder, setCurrentOrder] = useState({})  
    const [nextStatus, setNextStatus] = useState("")

    const allStatuses = useMemo(() => ["RECEIVED", "PICKED_UP", "ON_THE_WAY", "DELIVERED"], [])

    const getNextStatus = useCallback(() => {
        return allStatuses[allStatuses.indexOf(currentOrder.status) + 1]
    }, [allStatuses, currentOrder])
    
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
        fetch(`/order/change-status/${currentOrder.id}/${nextStatus}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        }).then(response => response.json()).then(response => {
            setNextStatus(getNextStatus())
            setCurrentOrder(response)
            window.location.reload()
        })
    }

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    const transformEnumValues = (value) => {
        return (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()).replaceAll("_", " ")
    }

    return(
        <Fragment>
            <div style={boxStyle}>
            {
                currentOrder !== undefined? <Fragment>
                    <Button onClick={changeStatus}>Change status to {transformEnumValues(nextStatus)}</Button> <br/> <br/>
                    <Order orderId={currentOrder.id}/>
                </Fragment>: null
            }
            </div>
           
           
        </Fragment>
    )
}

export default DeliverCurrentOrder