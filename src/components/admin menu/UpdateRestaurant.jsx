import { useState, useEffect } from "react"
import { Button, Container, Form } from "react-bootstrap"
import { useParams } from "react-router"


const UpdateRestaurant = ({restaurantId, getAllRestaurants, setEditModal}) => {

    const {paramId} = useParams()
    const id = paramId !== null && paramId !== undefined? paramId: restaurantId
    const [restaurant, setRestaurant] = useState({
        name:"",
        phoneNumber:""
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if(id > 0) {
            fetch(`/restaurant/get-by-id/${id}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            }).then(response => response.json()).then(response => {
                setRestaurant({
                    name: response.name,
                    phoneNumber: response.phoneNumber
                })
            })
        }      
    }, [id])

    const findFormErrors = () => {
        const {name, phoneNumber} = restaurant
        const newErrors = {}

        if(name === "") newErrors.name = "Required field"
        if(phoneNumber === "") newErrors.phoneNumber = "Required field"

        return newErrors
    }

    const update = () => {
        const newErrors = findFormErrors()
        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            fetch(`/restaurant/update/${id}`, {
                method: "PUT",
                body: JSON.stringify(restaurant),
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            }).then(response => {
                if(response.status === 200) {
                    setErrors({})
                    getAllRestaurants()
                    setEditModal(false)
                } 
            })
        }
    }

    return(
        <Container>
            <Form>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control value={restaurant.name} isInvalid={errors.name} onChange={(e) => setRestaurant({...restaurant, name:e.target.value})}/>
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control value={restaurant.phoneNumber} isInvalid={errors.phoneNumber} onChange={(e) => setRestaurant({...restaurant, phoneNumber:e.target.value})}/>
                    <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                </Form.Group> <br/>
                <Button variant="success" onClick={update}>Update details</Button>
            </Form>
        </Container>
    )
}

export default UpdateRestaurant