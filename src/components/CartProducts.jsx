import { Fragment, useContext, useEffect, useState } from "react"
import 'rsuite/dist/rsuite.min.css';
import { Panel } from 'rsuite';
import { Button} from "react-bootstrap"
import UserContext from "../components/context/UserContext"

const CartProducts = () => {

    const {user} = useContext(UserContext)
    const[deliveryTax, setDeliveryTax] = useState(0.0)
    const[orderValue, setOrderValue] = useState(0.0)
    
    const[products, setProducts] = useState([])

      const decreaseProductQuantity = (id) => { 
        const requestBody ={
            "clientId":user.id,
            "productId":id
        }
        fetch( `/order/cart/decrease-quantity`, {
            method: "POST",
            body:JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        })
        window.location.reload(false);
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
                "Content-Type": "application/json"
            }
        })
        window.location.reload(false);
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
                "Content-Type": "application/json"
            }
        })
        window.location.reload(false);
      }
     
      

    useEffect(() => {

        if(user.id !== undefined){
            fetch(`/order/cart/${user.id}`, {
      
            }).then(response => response.json()).then(response => {
                setProducts(response.products)
                setDeliveryTax(response.deliveryTax)
                setOrderValue(response.value)
          
            })
        }
   
  }, [user.id])
    return(
        
        <Fragment>
            {
                products !== undefined ? products.map((product, i) => <div key={i}>
                <br></br>
                <div style={{
                    display: 'block', width: 800, paddingLeft: 140
                }}>
                    <Panel shaded fontSize="30px">

                    <h3> {product.quantity}x {product.productDto.name}</h3>

                    <table >
                    <br></br>
                    <tr>Initial price: 
                        <td style={{paddingLeft:10}}>{ product.productDto.price * product.quantity}  lei</td>
                    </tr>
                    <tr>Discount:
                        <td style ={{color:"#d41919"}}>{product.productDto.discount}%</td>
                    </tr>
                    <tr>Price: 
                        <td>{((product.productDto.price -
                        (product.productDto.discount / 100 * product.productDto.price)) * product.quantity).toPrecision(4)} lei</td>
                    </tr>
                    </table>

                    <br></br>
                    <br></br><br>

                    </br>
                    <Button variant="secondary" onClick={() => decreaseProductQuantity(product.productDto.id)} negative className='quan-buttons'  style={{width:40, height:40, alignContent:"center"}}color="blue"> - </Button>
                {
                <input type="text" id="quantity"name="quantity" value={product.quantity} style={{width:40, alignContent:"center", paddingBottom:6}} />
                }
                <Button className='quan-buttons' onClick={() => increaseProductQuantity(product.productDto.id)} style={{width:40, height:40, alignContent:"center"}} >
                 + </Button>
                <Button className="delete-button"  onClick={() => deleteProduct(product.productDto.id)} style={{width:90, height:40, alignContent:"center", backgroundColor:"red", borderColor:"red", float:"right"}} >Remove</Button>
                </Panel>
                </div>
                
           
            
            <br></br>
          
            <div style={{
                    display: 'block', width: 800, paddingLeft: 140
                }}>
                    <Panel shaded fontSize="30px">
                   
                    <table >
               
                    <tr> <h3>Total:</h3>
                        <td> 
                        <h3> {(deliveryTax + orderValue).toPrecision(4)} lei</h3>
                        </td>    
                    </tr>
                    <tr>Delivery tax: 
                        <td style={{paddingLeft:10}}>{deliveryTax}  lei</td>
                    </tr>
                    <tr> Products price:
                        <td style ={{paddingLeft:10}}> {orderValue.toPrecision(4)} lei</td>
                    </tr>
                    </table>
                    <a href="/client-account/finish-order">
                    <Button shaded className="finish-order-button"  style={{width:140, height:40, alignContent:"center", backgroundColor:"#73BA9B", borderColor:"#73BA9B", fontSize:14, float:"right", fontWeight:"bold", marginBottom:10}} >FINISH ORDER</Button>
              
                    </a>
                    
                    <br></br>
                    </Panel>
                </div>
                <br></br>
                <br></br>
                </div>): null
            
        }
          {
            products === undefined &&
            <div>
                <p>Your cart is empty</p>
            </div>
          }
          {
            products.length <= 0 &&
            
            <div style={{
                      display: "flex", justifyContent: "center", alignItems: "center", marginTop:80
                }}>
                <br></br>
                <br></br>
                    <Panel shaded fontSize="30px">

                    <div>
                        <h3> Your cart is empty</h3>
                    </div>
                   </Panel>
                </div>
            
          }
        </Fragment>
        
    )

}

export default CartProducts