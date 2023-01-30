import { useCallback } from "react"
import { useState, useEffect, Fragment } from "react"
import { Button, Tab, Tabs } from "react-bootstrap"

const ClientNotifications = ({notifications}) => {

    const [unseenNotifications, setUnseenNotifications] = useState([])
    const [seenNotifications, setSeenNotifications] = useState([])
    const [tabsActiveKey, setTabsActiveKey] = useState("0")

    const filterNotifications = useCallback(() => {
        if(notifications !== undefined) {
            let filteredNotifications = notifications.filter(notification => notification.seen.toString() === "false")
            setUnseenNotifications(filteredNotifications)
            filteredNotifications = notifications.filter(notification => notification.seen.toString() === "true")
            setSeenNotifications(filteredNotifications)
        }
    }, [notifications])

    useEffect(() => {
       filterNotifications()
    }, [filterNotifications])

    const seeNotification = (id, index) => {
        fetch(`/order/see-notification/${id}`, {
            method: "PATCH"
        })
            .then(response => response.json())
            .then(response => {
                unseenNotifications.splice(index, 1)
                seenNotifications.push(response)
                setTabsActiveKey("1")
            })
    }

    return(
        <Fragment>
            <Tabs activeKey={tabsActiveKey} onSelect={(e) => setTabsActiveKey(e)}>
                <Tab eventKey={"0"} title={"Unseen"}>
                    {
                        unseenNotifications.length > 0? unseenNotifications.map((unseenNotification, i) => <Fragment key={i}>
                            <div key={i}>
                                Type: {unseenNotification.type.toLowerCase().replaceAll("_", " ")} <br/>
                                Order id: {unseenNotification.orderId} <br/>
                                Status: Unseen
                                <Button onClick={() => seeNotification(unseenNotification.id, i)}>See notification</Button>
                            </div>
                        </Fragment>): null
                    }
                </Tab>
                <Tab eventKey={"1"} title={"Seen"}>
                {
                    seenNotifications.length > 0? seenNotifications.map((seenNotification, i) => <div key={i}>
                        Type: {seenNotification.type.toLowerCase().replaceAll("_", " ")} <br/>
                        Order id: {seenNotification.orderId} <br/>
                        Status: Seen
                    </div>): null
                }
                </Tab>
            </Tabs>
            
        </Fragment>
    )
}

export default ClientNotifications