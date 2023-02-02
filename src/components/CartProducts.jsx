import { Fragment, useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import 'rsuite/dist/rsuite.min.css';
import { Panel } from 'rsuite';
import { Button, Container, Modal, Form, Icon} from "react-bootstrap"
import { COLOR } from "rsuite/esm/utils/constants";


const CartProducts = ({clientId}) => {

    
    const[products, setProducts] = useState([])

    const {idParam} = useParams()
    let id = idParam !== undefined ? idParam : clientId

    const jsonData = {
        "orderId": "",
        "productId":""
      }




    useEffect(() => {

      fetch(`/order/cart/${id}`, {
      
      }).then(response => response.json()).then(response => {
          setProducts(response.products)
      })
  
      return () => {
      }
  }, [id])
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
                    <Button variant="secondary" negative className='quan-buttons'  style={{width:40, height:40, alignContent:"center"}}color="blue"> - </Button>
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