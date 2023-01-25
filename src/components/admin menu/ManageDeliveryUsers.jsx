import { Fragment, useCallback } from "react"
import { useEffect, useState } from "react"
import { Button, Container, Modal } from "react-bootstrap"
import EditDeliveryUser from "./EditDeliveryUser"


const ManageDeliveryUsers = () => {

    const [allDeliveryUsers, setAllDeliveryUsers] = useState([])
    const [editModal, setEditModal] = useState(false)
    const [userToEdit, setUserToEdit] = useState({})

    const getAllDeliveryUsers = useCallback(() => {
        fetch("/order/all-delivery-users")
            .then(response => response.json())
            .then(response => setAllDeliveryUsers(response))
    }, [])

    useEffect(() => {
        getAllDeliveryUsers()
    }, [getAllDeliveryUsers])

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"5px"}

    const deleteDeliveryUser = (id) => {
        fetch(`/order/delete-delivery-user/${id}`, {
            method: "DELETE"
        }).then(response => {
            if(response.status === 200) {
                getAllDeliveryUsers()
            }
        })
    }

    const openEditModal = (user) => {
        setUserToEdit(user)
        setEditModal(true)
    }

    const hideEditModal = () => {
        setUserToEdit({})
        setEditModal(false)
    }

    return(
        <Container>
            {
                allDeliveryUsers.map((deliveryUser, i) => <Fragment key={i}>
                    <div style={boxStyle}>
                        <h3>First name: {deliveryUser.firstName}</h3>
                        <h3>Last name: {deliveryUser.lastName}</h3>
                        <h3>Email: {deliveryUser.email}</h3>
                        <h3>Phone number: {deliveryUser.phoneNumber}</h3>
                        <Button variant="danger" onClick={() => deleteDeliveryUser(deliveryUser.id)}>Delete</Button>
                        <Button onClick={() => openEditModal(deliveryUser)}>Edit</Button>
                    </div>
                    <Modal show={editModal} onHide={hideEditModal}>
                        <Modal.Header closeButton>Edit delivery user</Modal.Header>
                        <Modal.Body>
                            <EditDeliveryUser user={userToEdit}/>
                        </Modal.Body>
                    </Modal>
                </Fragment>)
            }
        </Container>
    )

}

export default ManageDeliveryUsers