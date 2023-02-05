import { Fragment, useCallback } from "react"
import { useEffect, useState } from "react"
import { Button, Container, Modal } from "react-bootstrap"
import EditDeliveryUser from "./EditDeliveryUser"

const ManageDeliveryUsers = () => {

    const [allDeliveryUsers, setAllDeliveryUsers] = useState([])
    const [editModal, setEditModal] = useState(false)
    const [userToEdit, setUserToEdit] = useState({})
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)

    const getAllDeliveryUsers = useCallback(() => {
        fetch("/order/all-delivery-users")
            .then(response => response.json())
            .then(response => setAllDeliveryUsers(response))
    }, [])

    useEffect(() => {
        getAllDeliveryUsers()
    }, [getAllDeliveryUsers])

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

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
        <Container style={boxStyle}>
            <h2 style={{textAlign:"center"}}>Manage delivery users</h2> <br/>
            {
                allDeliveryUsers.map((deliveryUser, i) => <Fragment key={i}>
                    <div style={boxStyle}>
                        <h5>First name: {deliveryUser.firstName}</h5>
                        <h5>Last name: {deliveryUser.lastName}</h5>
                        <h5>Email: {deliveryUser.email}</h5>
                        <h5>Phone number: {deliveryUser.phoneNumber}</h5>
                        <Button variant="danger" onClick={() => setShowConfirmDeleteModal(true)}>Delete</Button>
                        <Button onClick={() => openEditModal(deliveryUser)}>Edit</Button>
                    </div>
                    <Modal show={editModal} onHide={hideEditModal}>
                        <Modal.Header  closeButton>Edit delivery user</Modal.Header>
                        <Modal.Body>
                            <EditDeliveryUser user={userToEdit}/>
                        </Modal.Body>
                    </Modal>
                    <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
                        <Modal.Body>
                            Confirm deletion of delivery user?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => deleteDeliveryUser(deliveryUser.id)}>Delete</Button>
                            <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>Cancel</Button>
                        </Modal.Footer>
                    </Modal>
                </Fragment>)
            }
            
        </Container>
    )

}

export default ManageDeliveryUsers