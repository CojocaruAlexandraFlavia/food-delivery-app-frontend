import { Fragment, useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import 'rsuite/dist/rsuite.min.css';
import { Panel } from 'rsuite';
import { Button, Container, Modal, Form, Icon} from "react-bootstrap"
import UserContext from "../components/context/UserContext"

const CartProducts = () => {

    const {user} = useContext(UserContext)
    
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
      }

    useEffect(() => {

        if(user.id !== undefined){
            fetch(`/order/cart/${user.id}`, {
      
            }).then(response => response.json()).then(response => {
                setProducts(response.products)
          
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
                    <tr>initial price: 
                        <td style={{paddingLeft:10}}>{ product.productDto.price * product.quantity}  lei</td>
                    </tr>
                    <tr>  discount:
                        <td style ={{color:"#d41919"}}>{product.productDto.discount}%</td>
                    </tr>
                    <tr>price: 
                        <td>{(product.productDto.price -
                        (product.productDto.discount / 100 * product.productDto.price)) * product.quantity} lei</td>
                    </tr>
                    </table>

                    <br></br>
                    <Button variant="secondary" onClick={() => decreaseProductQuantity(product.productDto.id)} negative className='quan-buttons'  style={{width:40, height:40, alignContent:"center"}}color="blue"> - </Button>
                {
                <input type="text" id="quantity"name="quantity" value={product.quantity} style={{width:40, alignContent:"center", paddingBottom:6}} />
                }
                <Button className='quan-buttons' style={{width:40, height:40, alignContent:"center"}} onClick="">
                 + </Button>
                <br></br>
                </Panel>
                </div>
                <div className='quanity-group'>
              
                </div>
                  
            </div>): null
            }
        </Fragment>
    )

}

export default CartProducts