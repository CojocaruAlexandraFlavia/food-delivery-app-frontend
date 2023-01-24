import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';


const ProductsPage = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      setLoading(true);
  
      fetch('/product/get-by-id/${id}')
        .then(response => response.json())
        .then(data => {
          setProducts(data);
          setLoading(false);
        })
    }, []);
  
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