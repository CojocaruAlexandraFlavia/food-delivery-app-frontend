
import { Fragment } from "react"
import { Button } from "react-bootstrap"


const ClientNotifications = ({notifications}) => {

    const seeNotification = (id, index) => {

        fetch(`/order/see-notification/${id}`, {
            method: "PATCH"
        })
            .then(response => response.json())
            .then(response => notifications[index] = response)

    }

    
    return(
        <Fragment>
            {
                notifications !== undefined? notifications.map((notification, i) => <div key={i}>
                    Type: {notification.type.toLowerCase().replaceAll("_", " ")} <br/>
                    Order id: {notification.orderId} <br/>
                    Status: {notification.seen.toString() === "true" ? "Seen": "Unseen"}
                    {
                        notification.seen.toString() === "false"? <Button onClick={() => seeNotification(notification.id, i)}>See notification</Button>: null
                    }
                </div>): null
            }
        </Fragment>
    )
}

export default ClientNotifications