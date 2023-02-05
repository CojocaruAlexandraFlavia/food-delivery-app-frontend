import { useState } from "react"
import { Fragment } from "react"
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap"
import EditAddress from "./EditAddress"


const ClientSavedAddresses = ({addresses, user, setUser}) => {

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}
    const [showAddAdressModal, setShowAddAddressModal] = useState(false)
    const [newAddress, setNewAddress] = useState({
        address: "",
        city: "",
        zipCode: ""
    })
    const [newAddressErrors, setNewAddressErrors] = useState({})
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
    const [addressToDelete, setAddressToDelete] = useState({})

    const newAddressChange = (e) => {
        const {id, value} = e.target
        setNewAddress({ ...newAddress, [id]: value });
        if(newAddressErrors[id]) {
            setNewAddressErrors({...newAddressErrors, [id]: null})
        }
    }

    const findNewAddressErrors = () => {
        const {address, city, zipCode} = newAddress
        const newErrors = {}

        if(address === "") newErrors.address = "Required field"
        if(city === "") newErrors.city = "Required field"

        return newErrors
    }

    const saveAddress = () => {
        const newErrors = findNewAddressErrors()
        if(Object.keys(newErrors).length > 0) {
            setNewAddressErrors(newErrors)
        } else {
            fetch(`/user/add-client-address/${user.id}`, {
                method: "POST",
                body: JSON.stringify(newAddress),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json()).then(response => {
                setUser(response)
                setNewAddress({
                    address: "",
                    city: "",
                    zipCode: ""
                })
                setNewAddressErrors({})
                setShowAddAddressModal(false)
            })
        }
    }

    const handleDeleteAddressShowConfirmModal = (address) => {
        setAddressToDelete(address)
        setShowDeleteConfirmModal(true)
    }
    
    const handleDeleteAddress = () => {
        fetch(`/user/delete-address/${addressToDelete.id}`, {
            method: "DELETE"
        }).then(response => response.json()).then(response => {
            setUser(response)
            setShowDeleteConfirmModal(false)
            setAddressToDelete({})
        })
    }

    return(
        <Fragment>
            <Container style={boxStyle}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:"5px"}}>
                    <h2>Saved addresses</h2> <br/>
                    <Button variant="success" onClick={() => setShowAddAddressModal(true)}>Add address</Button>
                </div>
                <Row>
                {
                    addresses !== undefined ? addresses.map((address, i) => <Col md={4} key={i}>
                        <div style={boxStyle}>
                        {
                            address.address + "," + address.city + ", " + address.zipCode
                        } <br/>
                            <div style={{display: "flex", justifyContent: "space-between", marginTop:"5px"}}>
                                <EditAddress address={address}/>
                                <Button variant="danger" onClick={() => 
                                    handleDeleteAddressShowConfirmModal(address)}>Delete address</Button>
                            </div>
                        </div>                     
                    </Col>): null
                }
                </Row>
            </Container>          
            <Modal show={showAddAdressModal} onHide={() => setShowAddAddressModal(false)}>
                    <Modal.Header closeButton>Add address</Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>City</Form.Label>
                                <Form.Control id={"city"} value={newAddress.city} isInvalid={newAddressErrors.city} 
                                    onChange={newAddressChange}/>
                                <Form.Control.Feedback type="invalid">{newAddressErrors.city}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control id={"address"} value={newAddress.address} isInvalid={newAddressErrors.address} 
                                    onChange={newAddressChange}/>
                                <Form.Control.Feedback type="invalid">{newAddressErrors.address}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Zip code</Form.Label>
                                <Form.Control id={"zipCode"} value={newAddress.zipCode} isInvalid={newAddressErrors.zipCode} 
                                    onChange={newAddressChange}/>
                                <Form.Control.Feedback type="invalid">{newAddressErrors.zipCode}</Form.Control.Feedback>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={saveAddress}>Save address</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showDeleteConfirmModal} onHide={() => setShowDeleteConfirmModal(false)}>
                    <Modal.Header>Delete address</Modal.Header>
                    <Modal.Body>
                        Delete the selected address?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleDeleteAddress}>Confirm delete</Button>
                    </Modal.Footer>
                </Modal>
        </Fragment>
    )

}

export default ClientSavedAddresses