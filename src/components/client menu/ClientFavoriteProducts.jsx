import { useContext, useState } from "react"
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap"
import TextTruncate from "react-text-truncate"
import UserContext from "../context/UserContext"


const ClientFavoriteProducts = ({products}) => {

    const {user} = useContext(UserContext)
    const [productAddedToCart, setProductAddedToCart] = useState(false)
    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

    const addProductToCart = (id) => { 
          const requestBody ={
            "clientId":user.id,
            "productId":id,
            "quantity":1
          }
        fetch( `/order/add-products`, {
            method: "PUT",
            body:JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        }).then(response => {
          if(response.status === 200) {
            setProductAddedToCart(true)
              setTimeout(() => {
                setProductAddedToCart(false)
              }, 5000)
          }
        })
      }
      const removeProductFromFavorites = (id) => {
        const requestBody ={
            "clientId":user.id,
            "productId":id
          }
          
          fetch( `/product/remove-product-from-client-favorites`, {
            method: "POST",
            body:JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        })
        window.location.reload(false);
        
      }

    return(
        <Container style={boxStyle}>
            <h2 style={{textAlign:"center"}}>Favorite products</h2> <br/>
            <Row style={{padding: "5px"}}>
            {
                products !== undefined ? products.map((product, i) => <Col md={3} key={i}>
                    <Card style={{ width: '100%', height:"100%", boxShadow:"1px 1px 4px 4px lightgrey"}}>
                        <Card.Header>
                        <Card.Title>
                                <TextTruncate line={1} truncateText={"..."} text={product.name}/>
                               
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>                          
                            <Card.Text>Restaurant: {product.restaurantName}</Card.Text>
                            <Card.Text>Price: &euro;{product.price}</Card.Text>
                        </Card.Body> 
                        <Card.Footer style={{display:"flex", justifyContent:"center"}}>
                            <Button disabled={product.availability.toString() === "false"} variant="success" 
                                style={{alignSelf:"left"}} onClick={() => addProductToCart(product.id)}>Add to cart</Button>
                             <Button variant="danger" onClick={() => removeProductFromFavorites(product.id)} style={{alignSelf:"right", marginLeft:4}}> - </Button>
                        </Card.Footer>                      
                    </Card>
                </Col>): null
            }
            </Row>
            <Modal show={productAddedToCart}>
                <Modal.Body>Product added to cart!</Modal.Body>
            </Modal>
        </Container>
    )

}

export default ClientFavoriteProducts