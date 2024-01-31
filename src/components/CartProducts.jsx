import { Fragment, useContext, useEffect, useState } from "react"
import 'rsuite/dist/rsuite.min.css';
import { Panel } from 'rsuite';
import { Button, Container} from "react-bootstrap"
import UserContext from "../components/context/UserContext"
import ClientNavbar from "./client menu/ClientNavbar";

const CartProducts = () => {

    const total ="Total"
    const tax ="Delivery tax:"
    const productsPrice = "Products price:"
    const initialPrice = "Initial price:"
    const discount ="Discount:"
    const productPrice = "Price:"
    const percent ="%"

    const {user} = useContext(UserContext)
    const[deliveryTax, setDeliveryTax] = useState(0.0)
    const[orderValue, setOrderValue] = useState(0.0)
    const[products, setProducts] = useState([])

    const decreaseProductQuantity = (id, index) => { 
        if(products[index].quantity === 1){
            products.splice(index, 1) 
        }
        const requestBody ={
            "clientId":user.id,
            "productId":id
        }
        fetch( `/order/cart/decrease-quantity`, {
            method: "POST",
            body:JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        }).then(response => response.json()).then(response => {
            setProducts(response.products)
            setDeliveryTax(response.deliveryTax)
            setOrderValue(response.value)
        })  
    }

    const increaseProductQuantity=(id) =>{
        const requestBody ={
            "clientId":user.id,
            "productId":id
        }
        fetch( `/order/cart/increase-quantity`, {
            method: "POST",
            body:JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        }).then(response => response.json()).then(response => {
            setProducts(response.products)
            setDeliveryTax(response.deliveryTax)
            setOrderValue(response.value)
        })
    }

    const deleteProduct =(id) =>{
        const requestBody ={
            "clientId":user.id,
            "productId":id
        }
        fetch( `/order/cart/delete-product`, {
            method: "DELETE",
            body:JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        }).then(response => response.json()).then(response => {
            setProducts(response.products)
            setDeliveryTax(response.deliveryTax)
            setOrderValue(response.value)
        }) 
    }

    useEffect(() => {
        if(user.id !== undefined){
            fetch(`/order/cart/${user.id}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            }).then(async response =>{
                if(response.status === 200) {
                    const responseBody = await response.json()
                    setProducts(responseBody.products)
                    setDeliveryTax(responseBody.deliveryTax)
                    setOrderValue(responseBody.value)
                } else {
                    setProducts([])
                    setDeliveryTax(0.0)
                    setOrderValue(0.0)
                }})
        }
    }, [user.id])

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    return(
        <Fragment>
            <ClientNavbar/> <br/>
            <Container style={boxStyle}>
                <h3 style={{textAlign:"center"}}>Shopping cart</h3>
                {       
                    products.length > 0 ? products.map((product, i) => <div key={i}> <br></br>
                        <div >
                            <Panel shaded={true} fontSize="30px">
                                <h3> {product.quantity}x {product.productDto.name}</h3>
                                <table>
                                    <tbody>
                                        <tr>{initialPrice}
                                            <td style={{paddingLeft:10}}>&euro;{(product.productDto.price * product.quantity).toFixed(2)}</td>
                                        </tr>
                                        <tr>{discount}
                                            <td style ={{color:"#d41919"}}>{product.productDto.discount * 100}{percent}</td>
                                        </tr>
                                        <tr>{productPrice}
                                            <td>&euro;{((product.productDto.price -
                                            (product.productDto.discount / 100 * product.productDto.price)) * product.quantity).toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table> 
                                <Button variant="secondary" onClick={() => decreaseProductQuantity(product.productDto.id, i)} className='quan-buttons'  style={{width:40, height:40, alignContent:"center"}}color="blue"> - </Button>
                                {
                                    <input readOnly type="text" id="quantity"name="quantity" value={product.quantity} style={{width:40, alignContent:"center", paddingBottom:6}} />
                                }
                                <Button className='quan-buttons' onClick={() => increaseProductQuantity(product.productDto.id)} style={{width:40, height:40, alignContent:"center"}} >
                                + </Button>
                                <Button className="delete-button"  onClick={() => deleteProduct(product.productDto.id)} style={{width:90, height:40, alignContent:"center", backgroundColor:"red", borderColor:"red", float:"right"}} >Remove</Button>
                            </Panel>
                        </div>                
                    </div>):null
                } <br/>
                {
                    products.length > 0 &&
                    <div>
                        <Panel shaded={true} fontSize="30px">
                            <table >
                                <tbody>
                                    <tr style={{fontSize: 28, fontWeight: "bold"}}>{total}
                                        <td>&euro;{(deliveryTax + orderValue).toFixed(2)}</td>    
                                    </tr>
                                    <tr>{tax} 
                                        <td style={{paddingLeft:10}}>&euro;{deliveryTax}</td>
                                    </tr>
                                    <tr>{productsPrice}
                                        <td style ={{paddingLeft:10}}> &euro;{orderValue.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <a href="/client-account/finish-order">
                                <Button className="finish-order-button"  style={{width:140, height:40, alignContent:"center", backgroundColor:"#73BA9B", borderColor:"#73BA9B", fontSize:14, float:"right", fontWeight:"bold", marginBottom:10}} >FINISH ORDER</Button>
                            </a> <br/>
                        </Panel>
                    </div>   
                }
                {
                    products.length === 0 &&                       
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}> <br></br><br></br>
                                <Panel shaded={true} fontSize="30px" style={{textAlign:"center", alignSelf:"center"}}>
                                <div>
                                    <h3> Your cart is empty</h3> <br/> <br/>
                                    <h3>Go to <a href="/home-client">home page</a></h3>
                                </div>
                            </Panel>
                        </div>
                }        
            </Container>
          
        </Fragment>    
    )
}

export default CartProducts