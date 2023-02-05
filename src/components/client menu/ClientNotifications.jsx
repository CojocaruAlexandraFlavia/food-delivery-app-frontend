import { useCallback } from "react"
import { useState, useEffect, Fragment } from "react"
import { Button, Container, Tab, Tabs } from "react-bootstrap"

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

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Container style={boxStyle}>
            <h2>Notifications</h2> <br/>
            <Tabs activeKey={tabsActiveKey} onSelect={(e) => setTabsActiveKey(e)}>
                <Tab eventKey={"0"} title={"Unseen"}>
                    {
                        unseenNotifications.length > 0? unseenNotifications.map((unseenNotification, i) => <Fragment key={i}>
                            <div key={i} style={boxStyle}>
                                Type: {unseenNotification.type.toLowerCase().replaceAll("_", " ")} <br/>
                                Order id: {unseenNotification.orderId} <br/>
                                Status: Unseen
                                <Button onClick={() => seeNotification(unseenNotification.id, i)}>See notification</Button>
                            </div> <br/>
                        </Fragment>): <h3 style={{marginTop:"10px"}}>You have no new notifications!</h3>
                    }
                </Tab>
                <Tab eventKey={"1"} title={"Seen"}>
                {
                    seenNotifications.length > 0? seenNotifications.map((seenNotification, i) => <Fragment key={i}>
                        <div key={i} style={boxStyle}>
                            Type: {seenNotification.type.toLowerCase().replaceAll("_", " ")} <br/>
                            Order id: {seenNotification.orderId} <br/>
                            Status: Seen
                        </div> <br/>
                    </Fragment> ): null
                }
                </Tab>
            </Tabs>
            
        </Container>
    )
}

export default ClientNotifications