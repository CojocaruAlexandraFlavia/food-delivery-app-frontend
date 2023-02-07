import {Fragment, useContext, useEffect, useState } from "react"
import 'rsuite/dist/rsuite.min.css';
import { Panel } from 'rsuite';
import { Button} from "react-bootstrap"
import UserContext from "../components/context/UserContext"
import { Col, Container, Form, Row, Modal} from "react-bootstrap"

import React from "react";
import { useNavigate } from "react-router";
import ClientNavbar from "./client menu/ClientNavbar";


const FinishOrderPage = () => {

    const total ="Total"
    const tax ="Delivery tax:"
    const productsPrice = "Products price:"
    const initialPrice = "Initial price:"
    const discount ="Discount:"
    const productPrice = "Price:"

    const {user} = useContext(UserContext)
    const addresses = user.addresses
    const [checkedAddress, setCheckedAddress] = useState("0")
    const [errors, setErrors] = useState({})
    const[deliveryTax, setDeliveryTax] = useState(0.0)
    const[orderValue, setOrderValue] = useState(0.0)
    const[paymentType, setPaymentType] =useState("")
    const[products, setProducts] = useState([])
    const [locationErrors, setLocationErrors] = useState({})
    const [locationAdded, setLocationAdded] = useState(false)
    const [location, setLocation] = useState({
        city:"",
        address:"",
        zipCode:""
    })
    const [address, setAddress] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [showAddressErrorModal, setShowAddressErrorModal] = useState(false)
    const navigate = useNavigate();


    const findLocationErrors = () => {
        const {city, address, zipCode} = location
        const newErrors = {}
        const requiredField = "Required field"
        const invalidFormatOfZipCode = "Invalid format of zipCode"

        if(city === "") newErrors.city =  requiredField
        if(address === "") newErrors.address = requiredField
        if(zipCode === "") newErrors.zipCode = requiredField
        if(zipCode.length > 6) newErrors.zipCode = invalidFormatOfZipCode
        if(!zipCode.match("^[0-9]{6,6}$")) newErrors.zipCode = invalidFormatOfZipCode
        return newErrors
    }

    const addLocation = () => {
        const newLocationErrors = findLocationErrors()
        if(Object.keys(newLocationErrors).length > 0) {
            setLocationErrors(newLocationErrors)
            setLocationAdded(false)
        } else {
            const requestBody ={
                "clientId":user.id,
                "city":location.city,
                "address":location.address,
                "zipCode":location.zipCode
            }
            fetch( `/order/add-user-address`, {
                method: "POST",
                body:JSON.stringify(requestBody),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            })
            window.location.reload(false);
            const updatedLocationList = addresses
            updatedLocationList.push(location)
            setLocation({
                city:"",
                address:"",
                zipCode: ""
            })         
            setLocationErrors({})
            setErrors({...errors, locations:""})
            setLocationAdded(true)
            setTimeout(() => {
                setLocationAdded(false)
            }, 5000)           
        }
    }

    const onChange = (e) => {
        const {id, value} = e.target
        setCheckedAddress(value);
        if(errors[id]) {
            setErrors({...errors, [id]: null})
        }
        const filteredAddress = addresses.filter(a => {return a.id.toString() === value})[0]
        setAddress(filteredAddress)
    }

    const sendOrder = () => {
        if(checkedAddress !== "0") {
            if(address.city === user.preferredCity) {
                const requestBody ={
                    "clientId":user.id,
                    "addressId":checkedAddress  
                }
        
                fetch( `/order/send`, {
                    method: "POST",
                    body:JSON.stringify(requestBody),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                }).then(() =>{
                    setShowModal(true)
                    setTimeout(() => {
                        setShowModal(false)
                        navigate("/home-client")
                    }, 5000)
                })    
            } else {
                setShowAddressErrorModal(true)
                setTimeout(() => {
                    setShowAddressErrorModal(false)
                }, 4000)
            }          
        }else{
            setErrors({addressId: "Required field"})
        }
    }
    
    useEffect(() => {
        if(user.id !== undefined) {
            fetch(`/order/cart/${user.id}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            }).then(response => response.json()).then(response => {
                setProducts(response.products)
                setDeliveryTax(response.deliveryTax)
                setOrderValue(response.value)
                setPaymentType(response.paymentType)         
            })
        }  
    }, [user.id])

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Fragment>
            <ClientNavbar/> <br/>
            <Container style={boxStyle}>
                <h3 style={{textAlign:"center"}}>Finish order</h3>
                <Form>
                    <Form.Group>
                        <Row>
                            <Col md={7}>
                                <Form.Group><br/>
                                    <div style={{display: 'block', paddingLeft:"10px"}}>                
                                        <Panel shaded={true} fontSize="30px">
                                            <h3 style={{alignContent:"center"}}>Order Summary</h3>
                                            <div style={{display: 'block', width: 360, border: '2px solid #ccc', padding:10}}> 
                                                {
                                                    products !== undefined ? products.map((product, i) => <div key={i}>                                               
                                                        <h3> {product.quantity}x {product.productDto.name}</h3>
                                                        <table >
                                                            <tbody>
                                                                <tr>{initialPrice} 
                                                                    <td style={{paddingLeft:10}}>&euro;{ product.productDto.price * product.quantity}</td>
                                                                </tr>
                                                                <tr>{discount}
                                                                        <td style ={{color:"#d41919"}}>{product.productDto.discount}%</td>
                                                                </tr>
                                                                <tr>{productPrice} 
                                                                    <td>&euro;{(product.productDto.price -
                                                                        (product.productDto.discount / 100 * product.productDto.price)) * product.quantity}</td>
                                                                </tr>
                                                            </tbody>                                                      
                                                        </table>
                                                        <hr style={{width:300}}></hr>                                                
                                                    </div>):null
                                                }
                                            </div> <br/>
                                            <table>
                                                <tbody>
                                                    <tr>{tax}
                                                        <td style={{paddingLeft:10}}>&euro;{deliveryTax}</td>
                                                    </tr>
                                                    <tr>{productsPrice}
                                                        <td style ={{paddingLeft:10}}> &euro;{orderValue.toFixed(2)}</td>
                                                    </tr>
                                                    <tr> Payment method:
                                                        <td style ={{paddingLeft:10}}> {paymentType}</td>
                                                    </tr> <br/>
                                                    <tr style={{fontSize: 28, fontWeight: "bold"}}> {total}
                                                        <td> <h3> &euro;{(deliveryTax + orderValue).toFixed(2)}</h3> </td>    
                                                    </tr>
                                                </tbody>                                               
                                            </table>
                                            <Button id="sendOrder" disabled={checkedAddress === "0"}  variant="success" 
                                                className="finish-order-button" onClick={() => sendOrder() } 
                                                style={{width:120, height:40, alignContent:"center", float:"right", marginBottom:10}}>PROCEED</Button>
                                        </Panel>
                                    </div> <br/><br/>
                                </Form.Group>
                            </Col>
                            <Col md={5}>
                                <Panel shaded={true} fontSize="30px">
                                    <h3 style={{alignContent:"center"}}>Delivery address</h3> <br/> 
                                    <h6>Choose from saved addresses</h6>
                                    <Form.Select id={"addressId"} onChange={onChange} isInvalid={errors.addressId}>
                                        <option value={0}>Select an address</option>
                                        {
                                            addresses !== undefined ? addresses.map((address, i) => <option id={i} value={address.id} key={i}>
                                                {address.city + ", " + address.address + ", " + address.zipCode} 
                                            </option>):null
                                        }                             
                                    </Form.Select>
                                    <Form.Group> <br/> <br/>
                                        <Form.Label>Add address</Form.Label>
                                        <Form.Group>
                                            <Form.Label>City</Form.Label>
                                            <Form.Control value={location.city} isInvalid={locationErrors.city} onChange={(e) => setLocation({...location, city: e.target.value})}/>
                                            <Form.Control.Feedback type={"invalid"}>{locationErrors.city}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control value={location.address} isInvalid={locationErrors.address} onChange={(e) => setLocation({...location, address: e.target.value})}/>
                                            <Form.Control.Feedback type={"invalid"}>{locationErrors.address}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>ZipCode</Form.Label>
                                            <Form.Control value={location.zipCode} isInvalid={locationErrors.zipCode} onChange={(e) => setLocation({...location, zipCode: e.target.value})}/>
                                            <Form.Control.Feedback type={"invalid"}>{locationErrors.zipCode}</Form.Control.Feedback>
                                        </Form.Group> <br/><br/>                
                                        <Button onClick={addLocation} style={{width:120, height:40, alignContent:"center", backgroundColor:"#73BA9B", borderColor:"#73BA9B", float:"right", marginBottom:10}}>Add location</Button>
                                        {
                                            locationAdded ? <h4 style={{color:"green"}}>Location added successfully</h4>:null
                                        }
                                        {
                                            errors.locations ? <h3 style={{color:"red"}}>Locations are required!</h3>: null
                                        }
                                    </Form.Group>
                                </Panel>           
                            </Col>             
                        </Row>
                    </Form.Group>
                </Form>
                <Modal show={showModal}>     
                    <Modal.Body>
                        Order sent successfully!
                    </Modal.Body>
                </Modal>
                <Modal show={showAddressErrorModal}>
                    <Modal.Body>
                        Delivery address city doesn't correspond to your preferred city!
                    </Modal.Body>
                </Modal>
            </Container> 
        </Fragment>
    )
}
export default FinishOrderPage