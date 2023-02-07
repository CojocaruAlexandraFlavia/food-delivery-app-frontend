import React, { useEffect, Fragment, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import AddRestaurantManager from "./AddRestaurantManager"

const AddRestaurant = () => {

    const [restaurant, setRestaurant] = useState({
        name:"",
        phoneNumber:"",
        deliveryTax:0.0,
        restaurantManagerId:0,
        locations:[]
    })
    const [restaurantManagers, setRestaurantManagers] = useState([])
    const [errors, setErrors] = useState({})
    const [location, setLocation] = useState({
        city:"",
        address:""
    })
    const [locationErrors, setLocationErrors] = useState({})
    const [locationAdded, setLocationAdded] = useState(false)
    const [restaurantAdded, setRestaurantAdded] = useState(false)
    const [addNewManagerChecked, setAddNewManagerChecked] = useState(false)

    const getAllManagers = () => {
        fetch("/restaurant/managers").then(response => response.json()).then(response => setRestaurantManagers(response))

    }

    useEffect(() => {
       getAllManagers()
    }, [])

    const findFormErrors = () => {
        const {name, phoneNumber, deliveryTax, restaurantManagerId, locations} = restaurant
        const newErrors = {}
        const requiredField = "Required field"

        if(name === "") newErrors.name = requiredField
        if(phoneNumber === "") newErrors.phoneNumber = requiredField
        if(deliveryTax === 0.0) newErrors.deliveryTax = requiredField
        if(restaurantManagerId === 0) newErrors.restaurantManagerId = requiredField
        if(locations.length === 0) newErrors.locations = requiredField
        
        return newErrors
    }

    const onChange = (e) => {
        const {id, value} = e.target
        setRestaurant({ ...restaurant, [id]: value });
        if(errors[id]) {
            setErrors({...errors, [id]: null})
        }
    }

    const setRestaurantManagerId = (id) => {
        setRestaurant({...restaurant, restaurantManagerId: Number(id)})
        getAllManagers()
    }

    const findLocationErrors = () => {
        const {city, address} = location
        const newErrors = {}
        const requiredField = "Required field"

        if(city === "") newErrors.city =  requiredField
        if(address === "") newErrors.address = requiredField

        return newErrors
    }

    const addLocation = () => {
        const newLocationErrors = findLocationErrors()
        if(Object.keys(newLocationErrors).length > 0) {
            setLocationErrors(newLocationErrors)
            setLocationAdded(false)
        } else {
            const updatedLocationList = restaurant.locations
            updatedLocationList.push(location)
            setRestaurant({...restaurant, locations: updatedLocationList})
            setLocation({
                city:"",
                address:""
            })
            setLocationErrors({})
            setErrors({...errors, locations:""})
            setLocationAdded(true)
            setTimeout(() => {
                setLocationAdded(false)
            }, 5000)
        }
    }

    const saveRestaurant = () => {

        const newErrors = findFormErrors()
        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            const controller = new AbortController()
            const signal = controller.signal

            fetch("/restaurant/save", {
                method:"POST",
                body: JSON.stringify(restaurant),
                signal:signal,
                headers:{
                    "Content-Type":"application/json",
                    "Accept":"application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            }).then(response => {
                if(response.status === 200) {
                    setRestaurantAdded(true)
                    setErrors({})
                    setRestaurant({
                        name:"",
                        phoneNumber:"",
                        deliveryTax:0.0,
                        restaurantManagerId:0,
                        locations:[]
                    })
                    setTimeout(() => {
                        setRestaurantAdded(false)
                    }, 5000)
                }
            })
        }
    }

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Container style={boxStyle}>
            <h2 style={{textAlign:"center"}}>Add restaurant</h2> <br/>
            <Form style={boxStyle}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control id={"name"} value={restaurant.name} isInvalid={errors.name} onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control id={"phoneNumber"} value={restaurant.phoneNumber} isInvalid={errors.phoneNumber} onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.phoneNumber}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Delivery tax</Form.Label>
                    <Form.Control type="number" id={"deliveryTax"} value={restaurant.deliveryTax} isInvalid={errors.deliveryTax} onChange={onChange}/>
                    <Form.Control.Feedback type={"invalid"}>{errors.deliveryTax}</Form.Control.Feedback>
                </Form.Group> <br/>
                <Form.Group>
                    <Form.Label>Manager</Form.Label>
                    <Row>
                        <Col md={6}>
                            <Form.Label>Choose from existing restaurant managers</Form.Label>
                            <Form.Select id={"restaurantManagerId"} onChange={onChange} isInvalid={errors.restaurantManagerId}>
                                <option value={0}>Select a manager</option>
                                {
                                    restaurantManagers.map((manager, i) => <option id={i} value={manager.id} key={i}>
                                        {manager.firstName + " " + manager.lastName} 
                                    </option>)
                                }
                            </Form.Select>
                        </Col>
                        <Col md={6}>
                            <Form.Check checked={addNewManagerChecked} onChange={(e) => setAddNewManagerChecked(e.target.checked)} label={"Add new restaurant manager"}/>
                            {
                                addNewManagerChecked?  <AddRestaurantManager setRestaurantManagerId={setRestaurantManagerId}/> : null
                            }
                        </Col>                    
                    </Row>
                </Form.Group> <br/>
                <Form.Group>
                    <Form.Label>Locations</Form.Label>
                    {
                        restaurant.locations.map((location, i) => <Fragment key={i}>
                            <h4>{i}. {location.city}, {location.address}</h4>
                        </Fragment>)
                    } <br/>
                    <Form.Group>
                        <Form.Label>City</Form.Label>
                        <Form.Control value={location.city} isInvalid={locationErrors.city} onChange={(e) => setLocation({...location, city: e.target.value})}/>
                        <Form.Control.Feedback type={"invalid"}>{locationErrors.city}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control value={location.address} isInvalid={locationErrors.address} onChange={(e) => setLocation({...location, address: e.target.value})}/>
                        <Form.Control.Feedback type={"invalid"}>{locationErrors.address}</Form.Control.Feedback>
                    </Form.Group> <br/>
                    <Button variant="success" onClick={addLocation}>Add location</Button>
                    {
                       locationAdded ? <h3 style={{color:"green"}}>Location added successfully</h3>:null
                    }
                    {
                        errors.locations ? <h3 style={{color:"red"}}>Locations are required!</h3>: null
                    }
                </Form.Group> <br/> <br/>
                <div style={{display:"flex", justifyContent:"center"}}>
                    <Button variant="success" onClick={saveRestaurant}>Add restaurant</Button>
                </div> <br/><br/>
                {
                    restaurantAdded? <h3 style={{color:"green"}}>Restaurant added successfully</h3> : null
                }   
            </Form>
        </Container>
    )

}

export default AddRestaurant