import {useContext, useEffect, useState } from "react"
import 'rsuite/dist/rsuite.min.css';
import { Panel } from 'rsuite';
import { Button} from "react-bootstrap"
import UserContext from "../components/context/UserContext"
import { Col, Container, Form, Row} from "react-bootstrap"

import React from "react";


const FinishOrderPage = () => {

    const {user} = useContext(UserContext)
    const addresses = user.addresses
    const [checkedAddress, setCheckedAddress] = useState()
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
                    "Content-Type": "application/json"
                }
            })
            window.location.reload(false);
            const updatedLocationList = addresses
            updatedLocationList.push(location)
            setLocation({
                city:"",
                address:"",
                "zipCode": ""
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
    }
  

    const sendOrder =() =>{
        if(checkedAddress > 0){
            const requestBody ={
                "clientId":user.id,
                "addressId":checkedAddress
                
            }
    
            fetch( `/order/send`, {
                method: "POST",
                body:JSON.stringify(requestBody),
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }else{
            setErrors({addressId: "Required field"})
        }
        
      }
    useEffect(() => {

        if(user.id !== undefined){
            fetch(`/order/cart/${user.id}`, {
      
            }).then(response => response.json()).then(response => {
                setProducts(response.products)
                setDeliveryTax(response.deliveryTax)
                setOrderValue(response.value)
                setPaymentType(response.paymentType)
          
            })
        }
   
  }, [user.id])

    return(
        
        <Container>
        <br/>
        <Form>
            <Form.Group>
                <Row>
                    <Col md={4}>
                        <Form.Group >
            
                            <br/>
                        
                            <div style={{display: 'block', width: 400}}>
                                    
                                <Panel shaded={true} fontSize="30px">
                                
                                    <h3 style={{alignContent:"center"}}>Order Summary</h3>

                                    <div style={{display: 'block', width: 360, border: '2px solid #ccc', padding:10}}> 
                                    {
                                        products !== undefined ? products.map((product, i) => <div key={i}>
                                    
                                            <h3> {product.quantity}x {product.productDto.name}</h3>
                                            <table >
                                            <tr>Initial price: 
                                                <td style={{paddingLeft:10}}>{ product.productDto.price * product.quantity}  lei</td>
                                            </tr>
                                            <tr>Discount:
                                                <td style ={{color:"#d41919"}}>{product.productDto.discount}%</td>
                                            </tr>
                                            <tr>Price: 
                                                <td>{(product.productDto.price -
                                                (product.productDto.discount / 100 * product.productDto.price)) * product.quantity} lei</td>
                                            </tr>
                                            </table>
                                            <hr style={{width:300}}></hr>
                                        
                                    </div>
                            ):null}
                            </div>
                            <br/>
                                <table>
                                    <tr>Delivery tax: 
                                        <td style={{paddingLeft:10}}>{deliveryTax}  lei</td>
                                    </tr>
                                    <tr> Products price:
                                        <td style ={{paddingLeft:10}}> {orderValue.toFixed(2)} lei</td>
                                    </tr>
                                    <tr> Payment method:
                                        <td style ={{paddingLeft:10}}> {paymentType}</td>
                                    </tr>
                                    <br/>

                                    <tr> <h3>Total:</h3>
                                        <td> 
                                        <h3> {(deliveryTax + orderValue).toFixed(2)} lei</h3>
                                        </td>    
                                    </tr>
                                    </table>
                                   
                                    <Button variant="success" className="finish-order-button" onClick={() => sendOrder() } style={{width:120, height:40, alignContent:"center", float:"right", marginBottom:10}} >PROCEED</Button>
                                    
                                  
                                    <br></br>
                                    </Panel>
                                </div>
                                <br/>
                                <br/>
            
          
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <br/> <br/>
                            <Form.Select id={"addressId"} onChange={onChange} isInvalid={errors.addressId}>
                                <option value={0}>Select an address</option>
                                {
                                    addresses !== undefined ? addresses.map((address, i) => <option id={i} value={address.id} key={i}>
                                        {address.city + ", " + address.address + ", " + address.zipCode} 
                                    </option>)
                                    :null}
                               
                            </Form.Select>
                       
                        
                        <Form.Group>
                        <br/> <br/>
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
                            </Form.Group>
                            <br/><br/>
                            
                            <Button onClick={addLocation} style={{width:120, height:40, alignContent:"center", backgroundColor:"#73BA9B", borderColor:"#73BA9B", float:"right", marginBottom:10}}>Add location</Button>
                            {
                            locationAdded ? <h4 style={{color:"green"}}>Location added successfully</h4>:null
                            }
                            {
                                errors.locations ? <h3 style={{color:"red"}}>Locations are required!</h3>: null
                            }
                        </Form.Group>
                    </Col>             
                </Row>
                </Form.Group>
                
        
        
        </Form>
        
        
        </Container>

    )


}
export default FinishOrderPage