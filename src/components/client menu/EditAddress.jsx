import { useContext } from "react"
import { Fragment, useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import UserContext from "../context/UserContext"


const EditAddress = ({address}) => {

    const [showModal, setShowModal] = useState(false)
    const [updatedAddress, setUpdatedAddress] = useState({})
    const [updatedAddressErrors, setUpdatedAddressErrors] = useState({})

    const {user, setUser} = useContext(UserContext)

    useEffect(() => {
        setUpdatedAddress(address)
    }, [address])

    const updatedAddressChange = (e) => {
        const {id, value} = e.target
        setUpdatedAddress({ ...updatedAddress, [id]: value });
        if(updatedAddressErrors[id]) {
            setUpdatedAddressErrors({...updatedAddressErrors, [id]: null})
        }
    }

    const findUpdatedAddressErrors = () => {
        const {address, city, zipCode, country, county} = updatedAddress
        const newErrors = {}

        if(address === "") newErrors.address = "Required field"
        if(city === "") newErrors.city = "Required field"
        if(country === "") newErrors.country = "Required field"
        if(county === "") newErrors.county = "Required field"

        return newErrors
    }

    const saveUpdatedAddress = () => {
        const newErrors = findUpdatedAddressErrors()
        if(Object.keys(newErrors).length > 0) {
            setUpdatedAddressErrors(newErrors)
        } else {
            fetch(`/user/edit-address/${updatedAddress.id}`, {
                method: "PUT",
                body: JSON.stringify(updatedAddress),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            }).then(response => response.json()).then(response => {
                setUser(response)
                setShowModal(false)
                window.location.reload()
            })
        }
    }

    return(
        <Fragment>
            <Button variant="secondary" onClick={() => setShowModal(true)}>Edit address</Button>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>Edit address</Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>City</Form.Label>
                            <Form.Control id={"city"} value={updatedAddress.city} isInvalid={updatedAddressErrors.city} 
                                    onChange={updatedAddressChange}/>
                            <Form.Control.Feedback type="invalid">{updatedAddressErrors.city}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control id={"address"} value={updatedAddress.address} isInvalid={updatedAddressErrors.address} 
                                    onChange={updatedAddressChange}/>
                            <Form.Control.Feedback type="invalid">{updatedAddressErrors.address}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Zip code</Form.Label>
                            <Form.Control id={"zipCode"} value={updatedAddress.zipCode} isInvalid={updatedAddressErrors.zipCode} 
                                    onChange={updatedAddressChange}/>
                            <Form.Control.Feedback type="invalid">{updatedAddressErrors.zipCode}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>County</Form.Label>
                            <Form.Control id={"county"} value={updatedAddress.county} isInvalid={updatedAddressErrors.county} 
                                    onChange={updatedAddressChange}/>
                            <Form.Control.Feedback type="invalid">{updatedAddressErrors.county}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>County</Form.Label>
                            <Form.Control id={"county"} value={updatedAddress.county} isInvalid={updatedAddressErrors.country} 
                                    onChange={updatedAddressChange}/>
                            <Form.Control.Feedback type="invalid">{updatedAddressErrors.country}</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={saveUpdatedAddress}>Save</Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )

}

export default EditAddress