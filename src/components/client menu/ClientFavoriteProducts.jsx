import { Fragment } from "react"
import { Button, Card, Col, Container, Row } from "react-bootstrap"
import TextTruncate from "react-text-truncate"


const ClientFavoriteProducts = ({products}) => {

    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"10px"}

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
                            <Card.Text>Price: {product.price}</Card.Text>
                        </Card.Body> 
                        <Card.Footer style={{display:"flex", justifyContent:"center"}}>
                            <Button variant="success" style={{alignSelf:"center"}}>Add to cart</Button>
                        </Card.Footer>                      
                    </Card>
                </Col>): null
            }
            </Row>
         
        </Container>
    )

}

export default ClientFavoriteProducts