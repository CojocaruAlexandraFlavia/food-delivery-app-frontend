import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useParams } from "react-router"
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';


function MydModalWithGrid(props) {
  return (
    <Modal {...props} 
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Using Grid in Modal
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="show-grid">
        <Container>
          <Row>
            <Col xs={12} md={8}>
              .col-xs-12 .col-md-8
            </Col>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
          </Row>

          <Row>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
          </Row>
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}


const ProductsPage = () => {

  const [modalShow, setModalShow] = useState(false);


    const {id} = useParams()
    const [products, setProducts] = useState({
        name:"",
        ingredients:"",
        price:"",
        discount:"",
        availability:"",
        categoryName:"",
        restaurantName:""
    })
    
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      setLoading(true);
  
      fetch(`/product/get-by-id/${id}`)
        .then(response => response.json())
        .then(response => {
          setProducts(response)
          setLoading(false);
        })
    }, [id]);
  
    if (loading) {
      return <p>Loading...</p>;
    }

    const productList = products.map(product => {
        const details = `${product.ingredients || ''} ${product.price || ''} ${product.discount || ''} ${product.availability || ''} ${product.categoryName || ''} ${product.restaurantName || ''}`;
        
        return <tr key={product.id}>
          <td style={{whiteSpace: 'nowrap'}}>{product.name}</td>
          <td>{details}</td>
          <td>
            <ButtonGroup>
              <Button size="sm" color="primary" tag={Link} to={"/product/update/" + product.id}>Edit</Button>
            </ButtonGroup>
          </td>
        </tr>
      });
    
      return (
        <div>
          <Button variant="primary" onClick={() => setModalShow(true)}>
            Launch modal with grid
          </Button>
          
          <MydModalWithGrid 
          show={modalShow} 
          onHide={() => setModalShow(false)} />


          <Container fluid>
            <div className="float-end">
              <Button color="success" tag={Link} to="/product/save">Add Product</Button>
            </div>
            <h3>Products Page</h3>
            <Table className="mt-4">
              <thead>
              <tr>
                <th width="20%">Name</th>
                <th width="20%">Details</th>
                <th width="10%">Actions</th>
              </tr>
              </thead>
              <tbody>
              {productList}
              </tbody>
            </Table>
          </Container>
        </div>
      );
     };

export default ProductsPage;